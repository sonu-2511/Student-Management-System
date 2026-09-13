import React, { useEffect, useState } from 'react';
import { getAnnouncements } from '../api/announcementApi.js';
import ErrorMessage from './ErrorMessage.jsx';
import { formatDateTime } from '../utils/formatters.js';

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    getAnnouncements().then(setAnnouncements).catch(setError);
  }, []);

  return (
    <div className="sms-card p-3 mb-3">
      <h6 className="fw-semibold mb-3"><i className="bi bi-megaphone me-2" />Announcements</h6>
      {error && <ErrorMessage error={error} />}
      {announcements.length === 0 && !error && <div className="text-muted small">No active announcements.</div>}
      <div className="d-grid gap-3">
        {announcements.map((announcement) => (
          <article key={announcement.id}>
            <div className="d-flex justify-content-between gap-3">
              <strong>{announcement.title}</strong>
              <small className="text-muted text-nowrap">{formatDateTime(announcement.publishedAt)}</small>
            </div>
            <div className="small mt-1">{announcement.content}</div>
          </article>
        ))}
      </div>
    </div>
  );
}