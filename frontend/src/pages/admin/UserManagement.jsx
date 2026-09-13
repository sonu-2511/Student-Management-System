import React, { useEffect, useState } from 'react';
import ErrorMessage from '../../components/ErrorMessage.jsx';
import FormInput from '../../components/FormInput.jsx';
import DataTable from '../../components/DataTable.jsx';
import { getUsers, registerRequest, resetUserPassword, updateUserStatus } from '../../api/authApi.js';

const ROLE_OPTIONS = [
  { value: 'ADMIN', label: 'Admin' },
  { value: 'TEACHER', label: 'Teacher' }
];

const EMPTY_FORM = { username: '', email: '', password: '', role: '', studentId: '', teacherId: '' };

export default function UserManagement() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function loadUsers() {
    setLoadingUsers(true);
    try {
      const response = await getUsers({ size: 100 });
      setUsers(response.content);
    } catch (err) {
      setError(err);
    } finally {
      setLoadingUsers(false);
    }
  }

  useEffect(() => { loadUsers(); }, []);

  async function handleStatusChange(user) {
    setError(null);
    try {
      await updateUserStatus(user.id, !user.enabled);
      await loadUsers();
    } catch (err) {
      setError(err);
    }
  }

  async function handlePasswordReset(user) {
    const newPassword = window.prompt(`Enter a new password for ${user.username}`);
    if (!newPassword) return;
    setError(null);
    try {
      await resetUserPassword(user.id, newPassword);
      setSuccess(`Password reset for "${user.username}".`);
    } catch (err) {
      setError(err);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        studentId: form.studentId || null,
        teacherId: form.teacherId || null
      };
      const created = await registerRequest(payload);
      setSuccess(`Account "${created.username}" created with role ${created.role}.`);
      setForm(EMPTY_FORM);
    } catch (err) {
      setError(err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <h4 className="fw-bold mb-3">User Management</h4>

      <div className="sms-card p-4" style={{ maxWidth: 640 }}>
        {error && <ErrorMessage error={error} onDismiss={() => setError(null)} />}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="row g-3 mb-3">
            <FormInput colClass="col-md-6" label="Username" name="username" value={form.username} onChange={handleChange} required />
            <FormInput colClass="col-md-6" label="Email" name="email" type="email" value={form.email} onChange={handleChange} required />
            <FormInput colClass="col-md-6" label="Password" name="password" type="password" value={form.password} onChange={handleChange} required />
            <FormInput colClass="col-md-6" label="Role" name="role" as="select" options={ROLE_OPTIONS} value={form.role} onChange={handleChange} required />
            {form.role === 'TEACHER' && (
              <FormInput colClass="col-md-6" label="Linked Teacher ID" name="teacherId" type="number" value={form.teacherId} onChange={handleChange} />
            )}
          </div>
          <button type="submit" className="btn btn-primary px-4" disabled={submitting}>
            {submitting ? 'Creating...' : 'Create Account'}
          </button>
        </form>
      </div>

      <div className="sms-card p-3 mt-3">
        <h6 className="fw-semibold mb-3">Existing accounts</h6>
        <DataTable
          rows={users}
          loading={loadingUsers}
          emptyMessage="No login accounts found."
          columns={[
            { key: 'username', label: 'Username' },
            { key: 'role', label: 'Role' },
            { key: 'email', label: 'Email' },
            { key: 'status', label: 'Status', render: (user) => user.enabled ? 'Active' : 'Inactive' },
            {
              key: 'actions',
              label: 'Actions',
              render: (user) => (
                <div className="d-flex gap-2">
                  <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => handleStatusChange(user)}>
                    {user.enabled ? 'Deactivate' : 'Activate'}
                  </button>
                  <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => handlePasswordReset(user)}>
                    Reset password
                  </button>
                </div>
              )
            }
          ]}
        />
      </div>
    </div>
  );
}
