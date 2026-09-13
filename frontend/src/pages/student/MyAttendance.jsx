import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth.js';
import DataTable from '../../components/DataTable.jsx';
import Pagination from '../../components/Pagination.jsx';
import ErrorMessage from '../../components/ErrorMessage.jsx';
import { getAttendanceByStudent, getAttendanceSummary } from '../../api/attendanceApi.js';
import { formatDate, statusBadgeClass } from '../../utils/formatters.js';

export default function MyAttendance() {
  const { studentId } = useAuth();
  const [attendance, setAttendance] = useState({ content: [], page: 0, totalPages: 0, totalElements: 0 });
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!studentId) { setLoading(false); return; }
    setLoading(true);
    Promise.all([
      getAttendanceByStudent(studentId, { page, size: 15 }),
      getAttendanceSummary(studentId)
    ])
      .then(([records, attendanceSummary]) => {
        setAttendance(records);
        setSummary(attendanceSummary);
      })
      .catch(setError)
      .finally(() => setLoading(false));
  }, [studentId, page]);

  if (!studentId) return <div className="alert alert-warning">Your login isn't linked to a student profile yet.</div>;

  const columns = [
    { key: 'date', label: 'Date', render: (r) => formatDate(r.date) },
    { key: 'course', label: 'Course', render: (r) => r.course.courseName },
    { key: 'status', label: 'Status', render: (r) => <span className={`sms-badge-status ${statusBadgeClass(r.status)}`}>{r.status}</span> },
    { key: 'remarks', label: 'Remarks' }
  ];

  return (
    <div>
      <h4 className="fw-bold mb-3">My Attendance</h4>
      {error && <ErrorMessage error={error} />}
      {summary && (
        <div className="row g-3 mb-3">
          <SummaryCard label="Attendance" value={`${summary.attendancePercentage}%`} tone="text-primary" />
          <SummaryCard label="Present" value={summary.presentCount} tone="text-success" />
          <SummaryCard label="Absent" value={summary.absentCount} tone="text-danger" />
          <SummaryCard label="Leave" value={summary.leaveCount} tone="text-warning" />
        </div>
      )}
      <div className="sms-card p-3">
        <DataTable columns={columns} rows={attendance.content} loading={loading} emptyMessage="No attendance records yet." />
        <Pagination page={attendance.page} totalPages={attendance.totalPages} totalElements={attendance.totalElements} onPageChange={setPage} />
      </div>
    </div>
  );
}

function SummaryCard({ label, value, tone }) {
  return (
    <div className="col-sm-6 col-lg-3">
      <div className="sms-card p-3">
        <div className="text-muted small">{label}</div>
        <div className={`fs-4 fw-bold ${tone}`}>{value}</div>
      </div>
    </div>
  );
}
