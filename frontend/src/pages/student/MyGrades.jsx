import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth.js';
import LoadingSpinner from '../../components/LoadingSpinner.jsx';
import ErrorMessage from '../../components/ErrorMessage.jsx';
import { getMarksByStudent } from '../../api/marksApi.js';
import { gradeBadgeClass } from '../../utils/formatters.js';

export default function MyGrades() {
  const { studentId } = useAuth();
  const [marks, setMarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!studentId) { setLoading(false); return; }
    getMarksByStudent(studentId, { size: 100 })
      .then((res) => setMarks(res.content))
      .catch(setError)
      .finally(() => setLoading(false));
  }, [studentId]);

  if (!studentId) return <div className="alert alert-warning">Your login isn't linked to a student profile yet.</div>;
  if (loading) return <LoadingSpinner label="Loading your grades..." />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div>
      <h4 className="fw-bold mb-3">My Grades</h4>

      {marks.length === 0 ? (
        <div className="sms-empty-state">
          <i className="bi bi-award display-6 d-block mb-2" />
          No grades recorded yet.
        </div>
      ) : (
        <div className="row g-3">
          {marks.map((m) => (
            <div className="col-md-4" key={m.id}>
              <div className="sms-card p-3 h-100 d-flex flex-column justify-content-between">
                <div>
                  <div className="text-muted small">{m.course.courseCode}</div>
                  <h6 className="fw-semibold mb-2">{m.course.courseName}</h6>
                </div>
                <div className="d-flex align-items-center justify-content-between">
                  <span className="text-muted small">Total: {m.totalMarks}</span>
                  <span className={`sms-badge-status fs-6 ${gradeBadgeClass(m.grade)}`}>{m.grade}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
