import type { Review } from '@/lib/types';

interface ReviewCardProps {
  review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="review-card">
      <div className="review-card__top">
        <div className="review-card__main">
          {review.author && <p className="review-card__author">{review.author}</p>}
          {review.verifiedPurchase && (
            <div className="review-card__verified">
              <span aria-hidden>✓</span>
              <span>Verified Purchase</span>
            </div>
          )}
        </div>
        {review.rating && (
          <div className="review-card__stars" aria-label={`${review.rating} out of 5 stars`}>
            {[...Array(5)].map((_, i) => (
              <span key={i} className={i < review.rating! ? 'is-filled' : 'is-empty'}>
                {i < review.rating! ? '★' : '☆'}
              </span>
            ))}
          </div>
        )}
      </div>

      {review.title && <h4 className="review-card__title">{review.title}</h4>}

      {review.content && <p className="review-card__body">{review.content}</p>}

      <div className="review-card__meta">
        <span className="review-card__meta-date">
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          {new Date(review.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
        {review.helpfulCount !== undefined && review.helpfulCount > 0 && (
          <span className="review-card__meta-helpful">
            <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
            </svg>
            {review.helpfulCount} helpful
          </span>
        )}
      </div>
    </div>
  );
}
