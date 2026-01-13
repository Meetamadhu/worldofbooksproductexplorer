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
    // Save to browsing history (both client-side and server-side)
    if (product) {
      // Client-side localStorage
      saveToHistory(product);
      
      // Server-side history
      api.saveHistory(product.id).catch(console.error);
    }
  }, [product]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mb-4"></div>
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'The product you are looking for does not exist.'}</p>
          <button
            onClick={() => router.push('/products')}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const details = product.details;
  const reviews = product.reviews || [];
  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="mb-6 text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-2"
        >
          ← Back
        </button>

        {/* Product Main Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Image */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  className="w-full h-auto rounded-lg"
                />
              ) : (
                <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-6xl">📚</span>
                </div>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h1 className="text-4xl font-bold mb-4">{product.title}</h1>
              
              {product.author && (
                <p className="text-xl text-gray-700 mb-4">by {product.author}</p>
              )}

              {/* Rating */}
              {avgRating > 0 && (
                <div className="flex items-center gap-2 mb-6">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-2xl">
                        {i < Math.floor(avgRating) ? '⭐' : '☆'}
                      </span>
                    ))}
                  </div>
                  <span className="text-lg text-gray-600">
                    {avgRating.toFixed(1)} ({reviews.length} reviews)
                  </span>
                </div>
              )}

              {/* Price */}
              {product.price && (
                <div className="mb-6">
                  <span className="text-4xl font-bold text-indigo-600">
                    £{product.price.toFixed(2)}
                  </span>
                </div>
              )}

              {/* Description */}
              {details?.description && (
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold mb-3">Description</h2>
                  <p className="text-gray-700 leading-relaxed">{details.description}</p>
                </div>
              )}

              {/* Product Details */}
              <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                {details?.isbn && (
                  <div>
                    <span className="font-semibold text-gray-700">ISBN:</span>
                    <span className="ml-2 text-gray-600">{details.isbn}</span>
                  </div>
                )}
                {details?.publisher && (
                  <div>
                    <span className="font-semibold text-gray-700">Publisher:</span>
                    <span className="ml-2 text-gray-600">{details.publisher}</span>
                  </div>
                )}
                {details?.publicationDate && (
                  <div>
                    <span className="font-semibold text-gray-700">Publication Date:</span>
                    <span className="ml-2 text-gray-600">
                      {new Date(details.publicationDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {details?.pages && (
                  <div>
                    <span className="font-semibold text-gray-700">Pages:</span>
                    <span className="ml-2 text-gray-600">{details.pages}</span>
                  </div>
                )}
              </div>

              {/* Source Link */}
              {product.sourceUrl && (
                <a
                  href={product.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                  View on World of Books →
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Reviews */}
        {reviews.length > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Customer Reviews</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reviews.slice(0, 6).map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold mb-6">You May Also Like</h2>
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