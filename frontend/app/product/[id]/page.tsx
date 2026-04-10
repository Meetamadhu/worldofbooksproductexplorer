'use client';

import { useProductDetail } from '@/hooks/useProductDetail';
import ReviewCard from '@/components/ReviewCard';
import ProductCard from '@/components/ProductCard';
import { useEffect } from 'react';
import { api } from '@/lib/api';
import { saveToHistory } from '@/lib/history';
import { useRouter } from 'next/navigation';

interface ProductDetailPageProps {
  params: {
    id: string;
  };
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const router = useRouter();
  const { product, recommendations, loading, error } = useProductDetail(params.id);

  useEffect(() => {
    if (product) {
      saveToHistory(product);
      api.saveHistory(product.id).catch(console.error);
    }
  }, [product]);

  if (loading) {
    return (
      <div className="page-gradient flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="product-detail-loader" aria-hidden />
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="page-gradient flex items-center justify-center min-h-[50vh]">
        <div className="text-center max-w-md px-4">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'The product you are looking for does not exist.'}</p>
          <button type="button" onClick={() => router.push('/products')} className="btn btn-primary">
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const details = product.details;
  const reviews = product.reviews || [];
  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length
      : 0;

  const hasSpecs =
    !!details?.isbn ||
    !!details?.publisher ||
    !!details?.publicationDate ||
    !!details?.pages;

  return (
    <div className="page-gradient">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <button type="button" onClick={() => router.back()} className="product-detail-back">
          ← Back
        </button>

        <div className="product-detail-layout">
          <div className="product-detail-card product-detail-card--media">
            {product.imageUrl ? (
              <img src={product.imageUrl} alt={product.title} />
            ) : (
              <div className="product-detail-placeholder" aria-hidden>
                <span>📚</span>
              </div>
            )}
          </div>

          <div className="product-detail-card">
            <h1 className="product-detail-title">{product.title}</h1>

            {product.author && <p className="product-detail-author">by {product.author}</p>}

            {avgRating > 0 && (
              <div className="product-detail-rating">
                <div className="flex items-center" aria-hidden>
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-2xl">
                      {i < Math.floor(avgRating) ? '⭐' : '☆'}
                    </span>
                  ))}
                </div>
                <span className="product-detail-rating__meta">
                  {avgRating.toFixed(1)} ({reviews.length} reviews)
                </span>
              </div>
            )}

            {product.price != null && (
              <div className="product-detail-price">£{product.price.toFixed(2)}</div>
            )}

            {details?.description && (
              <div className="mb-6">
                <h2 className="product-detail-section-title">Description</h2>
                <p className="product-detail-description">{details.description}</p>
              </div>
            )}

            {hasSpecs && (
              <dl className="product-detail-specs">
                {details?.isbn && (
                  <>
                    <dt>ISBN</dt>
                    <dd>{details.isbn}</dd>
                  </>
                )}
                {details?.publisher && (
                  <>
                    <dt>Publisher</dt>
                    <dd>{details.publisher}</dd>
                  </>
                )}
                {details?.publicationDate && (
                  <>
                    <dt>Publication date</dt>
                    <dd>{new Date(details.publicationDate).toLocaleDateString()}</dd>
                  </>
                )}
                {details?.pages != null && (
                  <>
                    <dt>Pages</dt>
                    <dd>{details.pages}</dd>
                  </>
                )}
              </dl>
            )}

            {product.sourceUrl && (
              <a
                href={product.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="product-detail-cta"
              >
                View on World of Books →
              </a>
            )}
          </div>
        </div>

        {reviews.length > 0 && (
          <div className="mb-12">
            <h2 className="product-detail-section-heading">Customer Reviews</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reviews.slice(0, 6).map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          </div>
        )}

        {recommendations.length > 0 && (
          <div>
            <h2 className="product-detail-section-heading">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommendations.map((rec) => (
                <ProductCard key={rec.id} product={rec} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
