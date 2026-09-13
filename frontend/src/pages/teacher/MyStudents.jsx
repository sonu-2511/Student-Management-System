import React, { useEffect, useState } from 'react';
import DataTable from '../../components/DataTable.jsx';
import ErrorMessage from '../../components/ErrorMessage.jsx';
import { getStudents } from '../../api/studentApi.js';
import { getMyTeacherProfile } from '../../api/teacherApi.js';
import { initials, fullName, statusBadgeClass } from '../../utils/formatters.js';

/**
 */
export default function MyStudents() {
  const [courses, setCourses] = useState([]);
  const [courseId, setCourseId] = useState('');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    getMyTeacherProfile().then((teacher) => setCourses(teacher.courses || [])).catch(setError);
  }, []);

  async function handleLoad() {
    if (!courseId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await getStudents({ courseId, size: 200 });
      setStudents(res.content);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  const columns = [
    { key: 'profile', label: '', render: (row) => <span className="sms-avatar-sm">{initials(row.firstName, row.lastName)}</span> },
    { key: 'rollNumber', label: 'Roll Number' },
    { key: 'name', label: 'Name', render: (row) => fullName(row.firstName, row.lastName) },
    { key: 'email', label: 'Email' },
    { key: 'semester', label: 'Semester' },
    { key: 'status', label: 'Status', render: (row) => <span className={`sms-badge-status ${statusBadgeClass(row.status)}`}>{row.status}</span> }
  ];

  return (
    <div>
      <h4 className="fw-bold mb-3">My Students</h4>

      {error && <ErrorMessage error={error} onDismiss={() => setError(null)} />}

      <div className="sms-card p-3 mb-3">
        <div className="row g-2 align-items-end">
          <div className="col-md-8">
            <label className="form-label">Course</label>
            <select className="form-select" value={courseId} onChange={(e) => setCourseId(e.target.value)}>
              <option value="">Select course</option>
              {courses.map((c) => <option key={c.id} value={c.id}>{c.courseName} ({c.courseCode})</option>)}
            </select>
          </div>
          <div className="col-md-4">
            <button className="btn btn-primary w-100" onClick={handleLoad} disabled={!courseId}>View Students</button>
          </div>
        </div>
      </div>

      <div className="sms-card p-3">
        <DataTable columns={columns} rows={students} loading={loading} emptyMessage="Select a course to view its students." />
      </div>
    </div>
  );
}
