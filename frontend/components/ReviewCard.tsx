import type { Review } from '@/lib/types';

interface ReviewCardProps {
  review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-100">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-grow">
          {review.author && (
            <p className="font-bold text-gray-900 text-lg">{review.author}</p>
          )}
          {review.verifiedPurchase && (
            <div className="inline-flex items-center gap-1 mt-1">
              <span className="text-green-600 font-semibold">✓</span>
              <span className="text-xs text-green-600 font-medium">Verified Purchase</span>
            </div>
          )}
        </div>
        {review.rating && (
          <div className="flex items-center gap-0.5 bg-gradient-to-r from-yellow-50 to-orange-50 px-3 py-1 rounded-full">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={`text-lg ${
                i < review.rating! ? 'text-yellow-400' : 'text-gray-300'
              }`}>
                {i < review.rating! ? '★' : '☆'}
              </span>
            ))}
          </div>
        )}
      </div>

      {review.title && (
        <h4 className="font-bold text-gray-900 mb-3 text-base">{review.title}</h4>
      )}

      {review.content && (
        <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-4">{review.content}</p>
      )}

      <div className="flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-gray-100">
        <span className="flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {new Date(review.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
        {review.helpfulCount !== undefined && review.helpfulCount > 0 && (
          <span className="flex items-center gap-1 text-indigo-600 font-medium">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
            </svg>
            {review.helpfulCount} helpful
          </span>
        )}
      </div>
    </div>
  );
}