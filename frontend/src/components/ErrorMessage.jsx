import React from 'react';

/**
 * Renders a friendly error banner from either a plain string or an axios error object
 * shaped like the backend's ApiErrorResponse ({ message, fieldErrors }).
 */
export default function ErrorMessage({ error, onDismiss }) {
  if (!error) return null;

  const apiError = error?.response?.data;
  const message = apiError?.message || (typeof error === 'string' ? error : error?.message) || 'Something went wrong.';
  const fieldErrors = apiError?.fieldErrors || [];

  return (
    <div className="alert alert-danger d-flex align-items-start gap-2" role="alert">
      <i className="bi bi-exclamation-triangle-fill mt-1" />
      <div className="flex-grow-1">
        <div>{message}</div>
        {fieldErrors.length > 0 && (
          <ul className="mb-0 mt-1 ps-3">
            {fieldErrors.map((fe) => (
              <li key={fe.field}>
                <strong>{fe.field}:</strong> {fe.message}
              </li>
            ))}
          </ul>
        )}
      </div>
      {onDismiss && (
        <button type="button" className="btn-close" aria-label="Dismiss" onClick={onDismiss} />
      )}
    </div>
  );
}
