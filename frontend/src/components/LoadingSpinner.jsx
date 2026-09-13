import React from 'react';

export default function LoadingSpinner({ label = 'Loading...', size = 'md' }) {
  const spinnerClass = size === 'sm' ? 'spinner-border spinner-border-sm' : 'spinner-border';
  return (
    <div className="d-flex align-items-center justify-content-center gap-2 py-4 text-muted">
      <div className={spinnerClass} role="status" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}
