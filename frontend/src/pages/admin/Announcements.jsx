import React, { useState } from 'react';
import ErrorMessage from '../../components/ErrorMessage.jsx';
import FormInput from '../../components/FormInput.jsx';
import { createAnnouncement } from '../../api/announcementApi.js';

const AUDIENCE_OPTIONS = [
  { value: '', label: 'Everyone' },
  { value: 'STUDENT', label: 'Students' },
  { value: 'TEACHER', label: 'Faculty' }
];

export default function Announcements() {
  const [form, setForm] = useState({ title: '', content: '', audience: '', expiresAt: '' });
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((current) => ({ ...current, [name]: value }));
    setSaved(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    try {
      await createAnnouncement({ ...form, audience: form.audience || null, expiresAt: form.expiresAt || null });
      setForm({ title: '', content: '', audience: '', expiresAt: '' });
      setSaved(true);
    } catch (err) {
      setError(err);
    }
  }

  return (
    <div>
      <h4 className="fw-bold mb-3">Announcements</h4>
      <div className="sms-card p-4" style={{ maxWidth: 720 }}>
        {error && <ErrorMessage error={error} />}
        {saved && <div className="alert alert-success">Announcement published.</div>}
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <FormInput colClass="col-md-8" label="Title" name="title" value={form.title} onChange={handleChange} required />
            <FormInput colClass="col-md-4" label="Audience" name="audience" as="select" options={AUDIENCE_OPTIONS} value={form.audience} onChange={handleChange} />
            <FormInput colClass="col-12" label="Message" name="content" as="textarea" value={form.content} onChange={handleChange} required />
            <FormInput colClass="col-md-6" label="Expires at" name="expiresAt" type="datetime-local" value={form.expiresAt} onChange={handleChange} />
          </div>
          <button type="submit" className="btn btn-primary mt-3">Publish Announcement</button>
        </form>
      </div>
    </div>
  );
}