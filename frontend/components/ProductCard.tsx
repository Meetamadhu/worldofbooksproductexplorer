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
                borderRadius: '8px',
                transition: 'transform 0.3s ease'
              }} 
            />
          ) : (
            <span style={{ fontSize: '4rem' }}>📚</span>
          )}
        </div>
        
        <div style={{ 
          background: 'linear-gradient(to top, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.8) 100%)',
          padding: '0.75rem',
          borderRadius: '0 0 8px 8px',
          marginTop: '-0.5rem'
        }}>
          <h3 className="product-title" style={{
            background: 'linear-gradient(135deg, #1e40af 0%, #7c3aed 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>{product.title}</h3>
          
          {product.author && (
            <p className="product-author" style={{
              color: '#6b7280',
              fontSize: '0.875rem',
              marginBottom: '0.5rem',
              fontStyle: 'italic'
            }}>by {product.author}</p>
          )}
          
          {product.price !== null && product.price !== undefined ? (
            <div className="product-price" style={{
              background: 'linear-gradient(135deg, #ea580c 0%, #fb923c 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              marginTop: '0.5rem'
            }}>£{product.price.toFixed(2)}</div>
          ) : (
            <div style={{ 
              color: '#9ca3af', 
              fontSize: '0.875rem',
              fontStyle: 'italic'
            }}>Price unavailable</div>
          )}
        </div>

        <div style={{
          position: 'absolute',
          top: '0.5rem',
          right: '0.5rem',
          background: 'rgba(251, 146, 60, 0.9)',
          color: 'white',
          padding: '0.25rem 0.75rem',
          borderRadius: '20px',
          fontSize: '0.75rem',
          fontWeight: '600',
          backdropFilter: 'blur(4px)',
          boxShadow: '0 2px 8px rgba(234, 88, 12, 0.3)'
        }}>
          New
        </div>
      </div>
    </Link>
  );
}
