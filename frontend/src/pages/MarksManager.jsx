import React, { useEffect, useState } from 'react';
import ErrorMessage from '../components/ErrorMessage.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { getCourses } from '../api/courseApi.js';
import { getStudents } from '../api/studentApi.js';
import { getMarksByCourse, recordMarks, updateMarks } from '../api/marksApi.js';
import { fullName, gradeBadgeClass } from '../utils/formatters.js';

const EMPTY_COMPONENT = { internalMarks: '', assignmentMarks: '', practicalMarks: '', examMarks: '', remarks: '' };

export default function MarksManager({ heading = 'Marks' }) {
  const [courses, setCourses] = useState([]);
  const [courseId, setCourseId] = useState('');

  const [students, setStudents] = useState([]);
  const [existingByStudent, setExistingByStudent] = useState({});
  const [rows, setRows] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [savingId, setSavingId] = useState(null);

  useEffect(() => {
    getCourses({ size: 100 }).then((res) => setCourses(res.content)).catch(() => {});
  }, []);

  async function handleLoad() {
    if (!courseId) return;
    setLoading(true);
    setError(null);
    try {
      const [studentsRes, marksRes] = await Promise.all([
        getStudents({ courseId, size: 200 }),
        getMarksByCourse(courseId, { size: 200 })
      ]);

      const existing = {};
      marksRes.content.forEach((m) => { existing[m.student.id] = m; });

      const initialRows = {};
      studentsRes.content.forEach((s) => {
        const m = existing[s.id];
        initialRows[s.id] = m
          ? {
              internalMarks: m.internalMarks, assignmentMarks: m.assignmentMarks,
              practicalMarks: m.practicalMarks, examMarks: m.examMarks, remarks: m.remarks || ''
            }
          : { ...EMPTY_COMPONENT };
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
      const row = rows[studentId];
      const payload = {
        studentId,
        courseId: Number(courseId),
        internalMarks: Number(row.internalMarks || 0),
        assignmentMarks: Number(row.assignmentMarks || 0),
        practicalMarks: Number(row.practicalMarks || 0),
        examMarks: Number(row.examMarks || 0),
        remarks: row.remarks
      };
      const existing = existingByStudent[studentId];
      const saved = existing ? await updateMarks(existing.id, payload) : await recordMarks(payload);
      setExistingByStudent((e) => ({ ...e, [studentId]: saved }));
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
          <div className="col-md-8">
            <label className="form-label">Course</label>
            <select className="form-select" value={courseId} onChange={(e) => setCourseId(e.target.value)}>
              <option value="">Select course</option>
              {courses.map((c) => <option key={c.id} value={c.id}>{c.courseName} ({c.courseCode})</option>)}
            </select>
          </div>
          <div className="col-md-4">
            <button className="btn btn-primary w-100" onClick={handleLoad} disabled={!courseId}>
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
            <i className="bi bi-clipboard-data display-6 d-block mb-2" />
            Select a course and click "Load Students" to record marks.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table sms-table align-middle">
              <thead>
                <tr>
                  <th>Roll No.</th>
                  <th>Name</th>
                  <th style={{ width: 90 }}>Internal</th>
                  <th style={{ width: 100 }}>Assignment</th>
                  <th style={{ width: 100 }}>Practical</th>
                  <th style={{ width: 90 }}>Exam</th>
                  <th>Total / Grade</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => {
                  const existing = existingByStudent[s.id];
                  const row = rows[s.id] || EMPTY_COMPONENT;
                  return (
                    <tr key={s.id}>
                      <td>{s.rollNumber}</td>
                      <td>{fullName(s.firstName, s.lastName)}</td>
                      {['internalMarks', 'assignmentMarks', 'practicalMarks', 'examMarks'].map((field) => (
                        <td key={field}>
                          <input
                            type="number" min="0" max="100"
                            className="form-control form-control-sm"
                            value={row[field]}
                            onChange={(e) => updateRow(s.id, field, e.target.value)}
                          />
                        </td>
                      ))}
                      <td>
                        {existing ? (
                          <span>
                            {existing.totalMarks}{' '}
                            <span className={`sms-badge-status ${gradeBadgeClass(existing.grade)}`}>{existing.grade}</span>
                          </span>
                        ) : (
                          <span className="text-muted small">Not saved</span>
                        )}
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => saveRow(s.id)}
                          disabled={savingId === s.id}
                        >
                          {savingId === s.id ? 'Saving...' : existing ? 'Update' : 'Save'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
