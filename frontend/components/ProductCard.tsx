import Link from 'next/link';
import type { Product } from '@/lib/types';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/product/${product.id}`}>
      <div className="product-card" style={{ 
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div className="product-image" style={{
          position: 'relative',
          overflow: 'hidden'
        }}>
          {product.imageUrl ? (
            <img 
              src={product.imageUrl} 
              alt={product.title} 
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover', 
                borderRadius: '16px 16px 0 0',
                transition: 'transform 0.3s ease'
              }} 
            />
          ) : (
            <span style={{ fontSize: '4rem' }}>📚</span>
          )}
        </div>
        
        <div className="product-card-content">
          <h3 className="product-title">{product.title}</h3>

          {product.author && (
            <p className="product-author">by {product.author}</p>
          )}

          {product.price !== null && product.price !== undefined ? (
            <div className="product-price">£{product.price.toFixed(2)}</div>
          ) : (
            <div className="product-author" style={{ fontStyle: 'italic' }}>Price unavailable</div>
          )}
        </div>

        <div className="product-badge">
          New
        </div>
      </div>
    </Link>
  );
}
