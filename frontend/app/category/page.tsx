'use client';

import { Suspense } from 'react';
import { useCategories } from '@/hooks/useCategories';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import CategoryCard from '@/components/CategoryCard';
import LoadingSkeleton from '@/components/LoadingSkeleton';

function CategoriesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const navigationSlug = searchParams.get('navigation') || undefined;
  
  const { categories, loading, error } = useCategories(navigationSlug);

  return (
    <div className="container categories-page" style={{ padding: '2rem 1rem' }}>
      <div className="categories-page__header">
        <h1 className="categories-page__title">
          {navigationSlug ? `Categories in ${navigationSlug}` : 'All Categories'}
        </h1>
        <p className="categories-page__subtitle">Browse books by category</p>
      </div>

      {loading && (
        <div className="product-grid">
          <LoadingSkeleton count={6} />
        </div>
      )}

      {error && (
        <div style={{ background: '#fee', border: '1px solid #fcc', color: '#c33', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
          {error}
        </div>
      )}

      {!loading && !error && categories.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', background: 'var(--bg-white)', borderRadius: '12px', border: '1px solid var(--border-gray)' }}>
          <p style={{ fontSize: '1.5rem', color: 'var(--text-dark)', marginBottom: '0.5rem', fontWeight: '600' }}>No categories found</p>
          <p style={{ color: 'var(--text-gray)', marginBottom: '2rem' }}>
            {navigationSlug 
              ? `There are no categories scraped for "${navigationSlug}" yet.` 
              : 'Start scraping to populate categories!'}
          </p>
          <button
            onClick={() => router.push('/admin')}
            className="btn btn-primary"
            style={{ fontSize: '1rem', padding: '0.75rem 1.5rem' }}
          >
            🔧 Go to Admin Panel
          </button>
        </div>
      )}

      {!loading && !error && categories.length > 0 && (
        <div className="product-grid categories-page__grid">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function CategoriesPage() {
  return (
    <Suspense fallback={<LoadingSkeleton count={6} />}>
      <CategoriesContent />
    </Suspense>
  );
}
