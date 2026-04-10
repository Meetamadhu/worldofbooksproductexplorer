import Link from 'next/link';
import type { Category } from '@/lib/types';

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={`/category/${category.slug}`} className="category-browse-card-link">
      <article className="category-browse-card">
        <div className="category-browse-card__body">
          <span className="category-browse-card__icon" aria-hidden>
            📚
          </span>
          <h3 className="category-browse-card__title">{category.title}</h3>
          {category.description && (
            <p className="category-browse-card__desc">{category.description}</p>
          )}
        </div>
        <div className="category-browse-card__footer">
          {category.productCount !== undefined ? (
            <span className="category-browse-card__count" data-suf="products">
              {category.productCount}
            </span>
          ) : (
            <span className="category-browse-card__count category-browse-card__count--empty" />
          )}
          <span className="category-browse-card__cta">Explore →</span>
        </div>
      </article>
    </Link>
  );
}
