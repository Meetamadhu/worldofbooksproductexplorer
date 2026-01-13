'use client';

import { useProducts } from '@/hooks/useProducts';
import ProductGrid from '@/components/ProductGrid';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import Pagination from '@/components/Pagination';
import FilterPanel from '@/components/FilterPanel';
import { useState } from 'react';

export default function Products() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sortBy, setSortBy] = useState('');

  const { products, total, loading, error } = useProducts({
    page,
    limit: 12,
    search: search || undefined,
    categoryId: category || undefined,
    sortBy: sortBy || undefined,
  });

  const totalPages = Math.ceil(total / 12);

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--primary-orange)' }}>All Products</h1>
        <p style={{ color: 'var(--light-orange)' }}>
          Browse our complete catalog of {total} books
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '2rem' }}>
        <aside>
          <FilterPanel
            onCategoryChange={(cat) => {
              setCategory(cat);
              setPage(1);
            }}
            onSortChange={(sort) => {
              setSortBy(sort);
              setPage(1);
            }}
          />
        </aside>

        <div>
          {loading && <LoadingSkeleton count={12} />}

          {error && (
            <div style={{ background: '#fee', border: '1px solid #fcc', color: '#c33', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
              {error}
            </div>
          )}

          {!loading && !error && (!products || products.length === 0) && (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <p style={{ fontSize: '1.25rem', color: 'var(--text-gray)' }}>No products found</p>
            </div>
          )}

          {!loading && !error && products && products.length > 0 && (
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
      </div>
    </div>
  );
}
