import Link from 'next/link';
import type { Category } from '@/lib/types';

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={`/category/${category.slug}`}>
      <div className="category-card" style={{ height: '100%' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📚</div>
        
        <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.75rem', color: 'var(--text-dark)' }}>
          {category.title}
        </h3>
        
        {category.description && (
          <p style={{ color: 'var(--text-gray)', fontSize: '0.875rem', marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {category.description}
          </p>
        )}
        
        <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-gray)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {category.productCount !== undefined && (
            <span style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-gray)' }}>
              {category.productCount} {category.productCount === 1 ? 'product' : 'products'}
            </span>
          )}
          <span style={{ fontSize: '0.875rem', fontWeight: 'bold', color: 'var(--primary-orange)' }}>
            Explore →
          </span>
        </div>
      </div>
    </Link>
  );
}