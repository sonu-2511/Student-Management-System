import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth.js';
import DataTable from '../../components/DataTable.jsx';
import ErrorMessage from '../../components/ErrorMessage.jsx';
import { getMarksByStudent } from '../../api/marksApi.js';
import { gradeBadgeClass } from '../../utils/formatters.js';
import { downloadCsv } from '../../utils/downloads.js';

export default function MyMarks() {
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

  function handleDownload() {
    downloadCsv(
      'student-marks-report.csv',
      ['Course Code', 'Course Name', 'Internal', 'Assignment', 'Practical', 'Exam', 'Total', 'Grade'],
      marks.map((mark) => [
        mark.course?.courseCode,
        mark.course?.courseName,
        mark.internalMarks,
        mark.assignmentMarks,
        mark.practicalMarks,
        mark.examMarks,
        mark.totalMarks,
        mark.grade
      ])
    );
  }

  const columns = [
    { key: 'course', label: 'Course', render: (r) => r.course.courseName },
    { key: 'internalMarks', label: 'Internal' },
    { key: 'assignmentMarks', label: 'Assignment' },
    { key: 'practicalMarks', label: 'Practical' },
    { key: 'examMarks', label: 'Exam' },
    { key: 'totalMarks', label: 'Total' },
    { key: 'grade', label: 'Grade', render: (r) => <span className={`sms-badge-status ${gradeBadgeClass(r.grade)}`}>{r.grade}</span> }
  ];

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="fw-bold mb-0">My Marks</h4>
        <button type="button" className="btn btn-outline-primary" onClick={handleDownload} disabled={loading || marks.length === 0}>
          <i className="bi bi-download me-1" /> Download CSV
        </button>
      </div>
      {error && <ErrorMessage error={error} />}
      <div className="sms-card p-3">
        <DataTable columns={columns} rows={marks} loading={loading} emptyMessage="No marks recorded yet." />
      </div>
    </div>
  );
}
