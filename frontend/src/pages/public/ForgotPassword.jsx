import React, { useState } from 'react';
import { Link } from 'react-router-dom';

/**
 * Note: the backend API spec (Phases 1-8) only defines /api/auth/login and /api/auth/register —
 * there's no password-reset endpoint yet. This page collects the email and shows a confirmation
 * so the UI flow is complete; wire it to a real endpoint (e.g. POST /api/auth/forgot-password)
 * when that's added to the backend.
 */
export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="sms-auth-card">
      <div className="d-flex align-items-center gap-3 mb-4">
        <div className="sms-brand-mark">
          <i className="bi bi-mortarboard-fill" />
        </div>
        <div>
          <h4 className="mb-0 fw-bold">EduAdmin</h4>
          <small className="text-muted">Student Management System</small>
        </div>
      </div>

      <h5 className="mb-3">Reset your password</h5>

      {submitted ? (
        <div className="alert alert-success">
          If an account exists for <strong>{email}</strong>, password reset instructions have been sent.
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <p className="text-muted small">
            Enter your account email and we'll send you instructions to reset your password.
          </p>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email address</label>
            <input
              id="email"
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">Send reset link</button>
        </form>
      )}

      <div className="text-center mt-3">
        <Link to="/login" className="small text-decoration-none">
          <i className="bi bi-arrow-left" /> Back to login
        </Link>
      </div>
    </div>
  );
}
