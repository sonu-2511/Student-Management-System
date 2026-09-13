import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ErrorMessage from '../../components/ErrorMessage.jsx';
import LoadingSpinner from '../../components/LoadingSpinner.jsx';
import { getSetupStatus, bootstrapAdmin } from '../../api/setupApi.js';

export default function Setup() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [needsSetup, setNeedsSetup] = useState(false);
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    getSetupStatus()
      .then((res) => setNeedsSetup(res.needsSetup))
      .catch(() => setNeedsSetup(false))
      .finally(() => setChecking(false));
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await bootstrapAdmin(form);
      setDone(true);
    } catch (err) {
      setError(err);
    } finally {
      setSubmitting(false);
    }
  }

  if (checking) {
    return (
      <div className="sms-auth-card">
        <LoadingSpinner label="Checking setup status..." />
      </div>
    );
  }

  if (!needsSetup && !done) {
    return (
      <div className="sms-auth-card text-center">
        <i className="bi bi-check-circle text-success display-5 mb-3 d-block" />
        <h5>Setup already complete</h5>
        <p className="text-muted small">An admin account already exists. Ask them for a login, or use one of your own.</p>
        <Link to="/login" className="btn btn-primary">Go to Login</Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="sms-auth-card text-center">
        <i className="bi bi-check-circle text-success display-5 mb-3 d-block" />
        <h5>Admin account created</h5>
        <p className="text-muted small">
          You can now sign in as <strong>{form.username}</strong>. This setup page will no longer work — future accounts go through User Management once you're logged in.
        </p>
        <button className="btn btn-primary" onClick={() => navigate('/login')}>Go to Login</button>
      </div>
    );
  }

  return (
    <div className="sms-auth-card">
      <div className="d-flex align-items-center gap-3 mb-4">
        <div className="sms-brand-mark">
          <i className="bi bi-mortarboard-fill" />
        </div>
        <div>
          <h4 className="mb-0 fw-bold">EduAdmin</h4>
          <small className="text-muted">First-time setup</small>
        </div>
      </div>

      <div className="alert alert-info small">
        No accounts exist yet. Create the first administrator account below — this page
        deactivates itself permanently the moment it succeeds.
      </div>

      {error && <ErrorMessage error={error} onDismiss={() => setError(null)} />}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Username</label>
          <input className="form-control" name="username" value={form.username} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input type="email" className="form-control" name="email" value={form.email} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input type="password" className="form-control" name="password" value={form.password} onChange={handleChange} required />
          <div className="form-text">At least 8 characters, with a letter and a digit.</div>
        </div>
        <button type="submit" className="btn btn-primary w-100" disabled={submitting}>
          {submitting ? 'Creating...' : 'Create Admin Account'}
        </button>
      </form>

      <div className="text-center mt-3">
        <Link to="/login" className="small text-decoration-none">Already have an account? Sign in</Link>
      </div>
    </div>
  );
}
