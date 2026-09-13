import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center text-center" style={{ minHeight: '100vh' }}>
      <h1 className="display-1 fw-bold text-primary">404</h1>
      <p className="fs-5 text-muted mb-4">The page you're looking for doesn't exist.</p>
      <Link to="/" className="btn btn-primary">
        <i className="bi bi-house-door me-1" /> Back to home
      </Link>
    </div>
  );
}
