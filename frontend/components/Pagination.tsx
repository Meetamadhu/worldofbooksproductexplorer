interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const pages = [];
  const maxVisible = 7;

  let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let endPage = Math.min(totalPages, startPage + maxVisible - 1);

  if (endPage - startPage + 1 < maxVisible) {
    startPage = Math.max(1, endPage - maxVisible + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="pagination">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="page-btn"
        aria-label="Previous page"
      >
        ← Previous
      </button>

      {startPage > 1 && (
        <>
          <button onClick={() => onPageChange(1)} className="page-btn" aria-label="Go to page 1">
            1
          </button>
          {startPage > 2 && <span style={{ padding: '0.5rem' }}>...</span>}
        </>
      )}

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`page-btn ${page === currentPage ? 'active' : ''}`}
          aria-label={`Go to page ${page}`}
          aria-current={page === currentPage ? 'page' : undefined}
        >
          {page}
        </button>
      ))}

      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span style={{ padding: '0.5rem' }}>...</span>}
          <button onClick={() => onPageChange(totalPages)} className="page-btn" aria-label={`Go to page ${totalPages}`}>
            {totalPages}
          </button>
        </>
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="page-btn"
        aria-label="Next page"
      >
        Next →
      </button>
    </div>
  );
}
