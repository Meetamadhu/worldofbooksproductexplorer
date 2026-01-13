interface LoadingSkeletonProps {
  count?: number;
}

export default function LoadingSkeleton({ count = 12 }: LoadingSkeletonProps) {
  return (
    <div className="product-grid">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="product-card">
          <div className="product-image loading-skeleton" style={{ background: '#e5e7eb' }}></div>
          <div style={{ height: '1.5rem', background: '#e5e7eb', borderRadius: '4px', marginBottom: '0.5rem' }} className="loading-skeleton"></div>
          <div style={{ height: '1rem', background: '#e5e7eb', borderRadius: '4px', width: '75%', marginBottom: '0.5rem' }} className="loading-skeleton"></div>
          <div style={{ height: '1.5rem', background: '#e5e7eb', borderRadius: '4px', width: '50%', marginTop: '1rem' }} className="loading-skeleton"></div>
        </div>
      ))}
    </div>
  );
}