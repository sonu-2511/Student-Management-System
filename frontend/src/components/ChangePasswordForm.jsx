import React, { useState } from 'react';
import ErrorMessage from './ErrorMessage.jsx';
import FormInput from './FormInput.jsx';
import { changePassword } from '../api/authApi.js';

export default function ChangePasswordForm() {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((current) => ({ ...current, [name]: value }));
    setSaved(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSaved(false);
    if (form.newPassword !== form.confirmPassword) {
      setError(new Error('New passwords do not match'));
      return;
    }
    setSaving(true);
    try {
      await changePassword({ currentPassword: form.currentPassword, newPassword: form.newPassword });
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setSaved(true);
    } catch (err) {
      setError(err);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="sms-card p-4">
      <h6 className="fw-semibold text-muted mb-3">Change password</h6>
      {error && <ErrorMessage error={error} />}
      {saved && <div className="alert alert-success">Password changed successfully.</div>}
      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          <FormInput colClass="col-md-4" label="Current password" name="currentPassword" type="password" value={form.currentPassword} onChange={handleChange} required />
          <FormInput colClass="col-md-4" label="New password" name="newPassword" type="password" value={form.newPassword} onChange={handleChange} required />
          <FormInput colClass="col-md-4" label="Confirm new password" name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} required />
        </div>
        <button type="submit" className="btn btn-primary mt-3" disabled={saving}>
          {saving ? 'Saving...' : 'Change Password'}
        </button>
      </form>
    </div>
  );
}