import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { homeForRole } from '../../routes/ProtectedRoute.jsx';
import ErrorMessage from '../../components/ErrorMessage.jsx';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const auth = await login(username, password);
      const redirectTo = location.state?.from || homeForRole(auth.role);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="sms-auth-layout">
      <div className="sms-auth-hero">
        <div className="sms-auth-hero-inner">
          <div className="d-flex align-items-center gap-3 mb-4">
            <div className="sms-brand-mark">
              <i className="bi bi-building-check" />
            </div>
            <div>
              <div className="sms-brand-name">NorthStar</div>
              <small className="text-white-50">Campus Operations Suite</small>
            </div>
          </div>

          <h1>Academic operations, reimagined for modern institutions.</h1>
          <p>
            Manage admissions, attendance, grading, and student success from one intelligent campus platform.
          </p>

          <div className="sms-auth-feature-list">
            <div><i className="bi bi-check-circle-fill" /> Real-time enrollment visibility</div>
            <div><i className="bi bi-check-circle-fill" /> Attendance and performance insights</div>
            <div><i className="bi bi-check-circle-fill" /> Secure role-based access for staff and students</div>
          </div>
        </div>
      </div>

      <div className="sms-auth-card">
        <div className="d-flex align-items-center gap-3 mb-4">
          <div className="sms-brand-mark sms-brand-mark-light">
            <i className="bi bi-mortarboard-fill" />
          </div>
          <div>
            <h4 className="mb-0 fw-bold">Welcome back</h4>
            <small className="text-muted">Student Management System</small>
          </div>
        </div>

        <h5 className="mb-3">Sign in to your account</h5>

        {error && <ErrorMessage error={error} onDismiss={() => setError(null)} />}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">Username</label>
            <input
              id="username"
              type="text"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              id="password"
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <a href="/forgot-password" className="small text-decoration-none">Forgot password?</a>
            <a href="/setup" className="small text-decoration-none text-muted">First time here?</a>
          </div>
          <button type="submit" className="btn btn-primary w-100 sms-login-btn" disabled={submitting}>
            {submitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
