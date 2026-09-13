import React from 'react';

/**
 * @param page zero-based current page index (matches Spring Data's Pageable)
 * @param totalPages total number of pages
 * @param totalElements total record count, shown for context
 * @param onPageChange (nextZeroBasedPage) => void
 */
export default function Pagination({ page, totalPages, totalElements, onPageChange }) {
  if (totalPages <= 1) {
    return (
      <div className="d-flex justify-content-between align-items-center mt-3 text-muted small">
        <span>{totalElements} record{totalElements === 1 ? '' : 's'}</span>
      </div>
    );
  }

  const pages = Array.from({ length: totalPages }, (_, i) => i);
  const windowSize = 5;
  const start = Math.max(0, Math.min(page - Math.floor(windowSize / 2), totalPages - windowSize));
  const visiblePages = pages.slice(Math.max(0, start), Math.max(0, start) + windowSize);

  return (
    <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap gap-2">
      <span className="text-muted small">
        Page {page + 1} of {totalPages} &middot; {totalElements} record{totalElements === 1 ? '' : 's'}
      </span>
      <nav>
        <ul className="pagination mb-0">
          <li className={`page-item ${page === 0 ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => onPageChange(page - 1)}>
              Previous
            </button>
          </li>
          {visiblePages.map((p) => (
            <li key={p} className={`page-item ${p === page ? 'active' : ''}`}>
              <button className="page-link" onClick={() => onPageChange(p)}>
                {p + 1}
              </button>
            </li>
          ))}
          <li className={`page-item ${page >= totalPages - 1 ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => onPageChange(page + 1)}>
              Next
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}
