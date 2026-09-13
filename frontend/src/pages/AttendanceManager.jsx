import React, { useEffect, useState } from 'react';
import ErrorMessage from '../components/ErrorMessage.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { getCourses } from '../api/courseApi.js';
import { getStudents } from '../api/studentApi.js';
import { getAttendanceByCourse, markAttendance, updateAttendance } from '../api/attendanceApi.js';
import { fullName, statusBadgeClass } from '../utils/formatters.js';

const STATUS_OPTIONS = ['PRESENT', 'ABSENT', 'LEAVE'];

export default function AttendanceManager({ heading = 'Attendance' }) {
  const [courses, setCourses] = useState([]);
  const [courseId, setCourseId] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));

  const [students, setStudents] = useState([]);
  const [existingByStudent, setExistingByStudent] = useState({});
  const [rows, setRows] = useState({}); // studentId -> { status, remarks }
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [savingId, setSavingId] = useState(null);

  useEffect(() => {
    getCourses({ size: 100 }).then((res) => setCourses(res.content)).catch(() => {});
  }, []);

  async function handleLoad() {
    if (!courseId || !date) return;
    setLoading(true);
    setError(null);
    try {
      const [studentsRes, attendanceRes] = await Promise.all([
        getStudents({ courseId, size: 200 }),
        getAttendanceByCourse(courseId, { size: 500 })
      ]);

      const existing = {};
      attendanceRes.content
        .filter((a) => a.date === date)
        .forEach((a) => { existing[a.student.id] = a; });

      const initialRows = {};
      studentsRes.content.forEach((s) => {
        initialRows[s.id] = {
          status: existing[s.id]?.status || 'PRESENT',
          remarks: existing[s.id]?.remarks || ''
        };
      });

      setStudents(studentsRes.content);
      setExistingByStudent(existing);
      setRows(initialRows);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  function updateRow(studentId, field, value) {
    setRows((r) => ({ ...r, [studentId]: { ...r[studentId], [field]: value } }));
  }

  async function saveRow(studentId) {
    setSavingId(studentId);
    setError(null);
    try {
      const payload = {
        studentId,
        courseId: Number(courseId),
        date,
        status: rows[studentId].status,
        remarks: rows[studentId].remarks
      };
      const existing = existingByStudent[studentId];
      if (existing) {
        const updated = await updateAttendance(existing.id, payload);
        setExistingByStudent((e) => ({ ...e, [studentId]: updated }));
      } else {
        const created = await markAttendance(payload);
        setExistingByStudent((e) => ({ ...e, [studentId]: created }));
      }
    } catch (err) {
      setError(err);
    } finally {
      setSavingId(null);
    }
  }

  return (
    <div>
      <h4 className="fw-bold mb-3">{heading}</h4>

      {error && <ErrorMessage error={error} onDismiss={() => setError(null)} />}

      <div className="sms-card p-3 mb-3">
        <div className="row g-2 align-items-end">
          <div className="col-md-5">
            <label className="form-label">Course</label>
            <select className="form-select" value={courseId} onChange={(e) => setCourseId(e.target.value)}>
              <option value="">Select course</option>
              {courses.map((c) => <option key={c.id} value={c.id}>{c.courseName} ({c.courseCode})</option>)}
            </select>
          </div>
          <div className="col-md-4">
            <label className="form-label">Date</label>
            <input type="date" className="form-control" value={date} max={new Date().toISOString().slice(0, 10)} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="col-md-3">
            <button className="btn btn-primary w-100" onClick={handleLoad} disabled={!courseId || !date}>
              Load Students
            </button>
          </div>
        </div>
      </div>

      <div className="sms-card p-3">
        {loading ? (
          <LoadingSpinner label="Loading students..." />
        ) : students.length === 0 ? (
          <div className="sms-empty-state">
            <i className="bi bi-calendar-check display-6 d-block mb-2" />
            Select a course and date, then click "Load Students" to mark attendance.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table sms-table align-middle">
              <thead>
                <tr>
                  <th>Roll No.</th>
                  <th>Name</th>
                  <th>Status</th>
                  <th>Remarks</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s.id}>
                    <td>{s.rollNumber}</td>
                    <td>{fullName(s.firstName, s.lastName)}</td>
                    <td>
                      <select
                        className="form-select form-select-sm"
                        value={rows[s.id]?.status}
                        onChange={(e) => updateRow(s.id, 'status', e.target.value)}
                      >
                        {STATUS_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    </td>
                    <td>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={rows[s.id]?.remarks || ''}
                        onChange={(e) => updateRow(s.id, 'remarks', e.target.value)}
                      />
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => saveRow(s.id)}
                        disabled={savingId === s.id}
                      >
                        {savingId === s.id ? 'Saving...' : existingByStudent[s.id] ? 'Update' : 'Mark'}
                      </button>
                      {existingByStudent[s.id] && (
                        <span className={`sms-badge-status ms-2 ${statusBadgeClass(existingByStudent[s.id].status)}`}>
                          Saved: {existingByStudent[s.id].status}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
