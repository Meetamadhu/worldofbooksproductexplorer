'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import ProductGrid from '@/components/ProductGrid';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import Pagination from '@/components/Pagination';
import type { Category, Product } from '@/lib/types';

interface CategoryDetailPageProps {
  params: {
    slug: string;
  };
}

export default function CategoryDetailPage({ params }: CategoryDetailPageProps) {
  const router = useRouter();
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const limit = 12;
  const totalPages = Math.ceil(total / limit);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch category details by slug
        const categoryData = await api.getCategoryBySlug(params.slug);
        setCategory(categoryData);

        // Fetch products for this category
        const productsData = await api.getProducts({
          categoryId: categoryData.id,
          page,
          limit,
        });
        setProducts(productsData.data);
        setTotal(productsData.total);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load category');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.slug, page]);

  if (loading && !category) {
    return (
      <div className="container" style={{ padding: '3rem 1rem', textAlign: 'center' }}>
        <div className="loading-skeleton" style={{ width: '4rem', height: '4rem', borderRadius: '50%', margin: '0 auto 1rem', background: 'var(--pale-blue)' }}></div>
        <p style={{ color: 'var(--text-gray)' }}>Loading category...</p>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="container" style={{ padding: '3rem 1rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#c33', marginBottom: '1rem' }}>Category Not Found</h1>
        <p style={{ color: 'var(--text-gray)', marginBottom: '2rem' }}>{error || 'The category you are looking for does not exist.'}</p>
        <button
          onClick={() => router.push('/category')}
          className="btn btn-primary"
        >
          Back to Categories
        </button>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <button
        onClick={() => router.back()}
        className="btn btn-secondary"
        style={{ marginBottom: '1.5rem' }}
      >
        ← Back
      </button>

      <div style={{ background: 'var(--bg-white)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-gray)', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem', color: 'var(--primary-blue)' }}>{category.title}</h1>
        {category.description && (
          <p style={{ color: 'var(--text-gray)', fontSize: '1.125rem', lineHeight: '1.6', marginBottom: '1rem' }}>{category.description}</p>
        )}
        <p style={{ color: 'var(--primary-orange)', fontWeight: '600' }}>
          {total} {total === 1 ? 'product' : 'products'} available
        </p>
      </div>

      {loading && <LoadingSkeleton count={12} />}

      {!loading && products.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', background: 'var(--bg-white)', borderRadius: '12px', border: '1px solid var(--border-gray)' }}>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-gray)', marginBottom: '1rem' }}>No products found in this category</p>
          <p style={{ color: 'var(--text-gray)' }}>Check back later for updates!</p>
        </div>
      )}

      {!loading && products.length > 0 && (
        <>
          <ProductGrid products={products} />
          
          {totalPages > 1 && (
            <div style={{ marginTop: '2rem' }}>
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
