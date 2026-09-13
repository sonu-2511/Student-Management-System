import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import ErrorMessage from '../../components/ErrorMessage.jsx';
import LoadingSpinner from '../../components/LoadingSpinner.jsx';
import { getDepartments } from '../../api/departmentApi.js';
import { getCourses } from '../../api/courseApi.js';
import {
  getStudentsByDepartmentReport, getStudentsBySemesterReport,
  getAttendanceReport, getGradeDistributionReport
} from '../../api/dashboardApi.js';
import { downloadCsv } from '../../utils/downloads.js';

export default function Reports() {
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [filters, setFilters] = useState({ departmentId: '', courseId: '', semester: '', fromDate: '', toDate: '' });

  const [studentsByDept, setStudentsByDept] = useState([]);
  const [studentsBySemester, setStudentsBySemester] = useState([]);
  const [attendance, setAttendance] = useState(null);
  const [gradeDistribution, setGradeDistribution] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getDepartments().then(setDepartments).catch(() => {});
    getCourses({ size: 100 }).then((res) => setCourses(res.content)).catch(() => {});
  }, []);

  async function loadReports() {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      Object.entries(filters).forEach(([k, v]) => { if (v) params[k] = v; });

      const [byDept, bySemester, attendanceData, gradeData] = await Promise.all([
        getStudentsByDepartmentReport(),
        getStudentsBySemesterReport(),
        getAttendanceReport(params),
        getGradeDistributionReport({ departmentId: params.departmentId, courseId: params.courseId, semester: params.semester })
      ]);
      setStudentsByDept(byDept);
      setStudentsBySemester(bySemester);
      setAttendance(attendanceData);
      setGradeDistribution(gradeData);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadReports(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);

  function exportReports() {
    const rows = [
      ['Attendance total records', attendance?.totalRecords || 0],
      ['Attendance present', attendance?.presentCount || 0],
      ['Attendance absent', attendance?.absentCount || 0],
      ['Attendance leave', attendance?.leaveCount || 0],
      ['Attendance percentage', attendance?.attendancePercentage || 0],
      ...gradeDistribution.map((item) => [`Grade ${item.label}`, item.count]),
      ...studentsByDept.map((item) => [`Students ${item.label}`, item.count]),
      ...studentsBySemester.map((item) => [`Students ${item.label}`, item.count])
    ];
    downloadCsv('admin-report.csv', ['Metric', 'Value'], rows);
  }

  return (
    <div>
      <h4 className="fw-bold mb-3">Reports</h4>

      {error && <ErrorMessage error={error} onDismiss={() => setError(null)} />}

      <div className="sms-card p-3 mb-3">
        <div className="row g-2 align-items-end">
          <div className="col-md-3">
            <label className="form-label">Department</label>
            <select className="form-select" value={filters.departmentId} onChange={(e) => setFilters((f) => ({ ...f, departmentId: e.target.value }))}>
              <option value="">All</option>
              {departments.map((d) => <option key={d.id} value={d.id}>{d.departmentName}</option>)}
            </select>
          </div>
          <div className="col-md-3">
            <label className="form-label">Course</label>
            <select className="form-select" value={filters.courseId} onChange={(e) => setFilters((f) => ({ ...f, courseId: e.target.value }))}>
              <option value="">All</option>
              {courses.map((c) => <option key={c.id} value={c.id}>{c.courseName}</option>)}
            </select>
          </div>
          <div className="col-md-2">
            <label className="form-label">Semester</label>
            <select className="form-select" value={filters.semester} onChange={(e) => setFilters((f) => ({ ...f, semester: e.target.value }))}>
              <option value="">All</option>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="col-md-2">
            <label className="form-label">From</label>
            <input type="date" className="form-control" value={filters.fromDate} onChange={(e) => setFilters((f) => ({ ...f, fromDate: e.target.value }))} />
          </div>
          <div className="col-md-2">
            <label className="form-label">To</label>
            <input type="date" className="form-control" value={filters.toDate} onChange={(e) => setFilters((f) => ({ ...f, toDate: e.target.value }))} />
          </div>
        </div>
        <button className="btn btn-primary mt-3" onClick={loadReports}>
          <i className="bi bi-funnel me-1" /> Apply Filters
        </button>
        <button className="btn btn-outline-secondary mt-3 ms-2" onClick={exportReports} disabled={loading}>
          <i className="bi bi-download me-1" /> Export CSV
        </button>
      </div>

      {loading ? (
        <LoadingSpinner label="Loading reports..." />
      ) : (
        <div className="row g-3">
          <div className="col-lg-6">
            <div className="sms-card p-3">
              <h6 className="fw-semibold mb-3">Students by Department</h6>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={studentsByDept.map((d) => ({ name: d.label, count: d.count }))}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#2c5282" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="sms-card p-3">
              <h6 className="fw-semibold mb-3">Students by Semester</h6>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={studentsBySemester.map((d) => ({ name: d.label, count: d.count }))}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3182ce" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="sms-card p-3">
              <h6 className="fw-semibold mb-3">Attendance Report</h6>
              {attendance && (
                <div className="row text-center g-2">
                  <div className="col-3"><div className="fs-4 fw-bold">{attendance.totalRecords}</div><div className="small text-muted">Total</div></div>
                  <div className="col-3"><div className="fs-4 fw-bold text-success">{attendance.presentCount}</div><div className="small text-muted">Present</div></div>
                  <div className="col-3"><div className="fs-4 fw-bold text-danger">{attendance.absentCount}</div><div className="small text-muted">Absent</div></div>
                  <div className="col-3"><div className="fs-4 fw-bold text-warning">{attendance.leaveCount}</div><div className="small text-muted">Leave</div></div>
                  <div className="col-12 mt-2"><strong>{attendance.attendancePercentage}%</strong> overall attendance</div>
                </div>
              )}
            </div>
          </div>

          <div className="col-lg-6">
            <div className="sms-card p-3">
              <h6 className="fw-semibold mb-3">Grade Distribution</h6>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={gradeDistribution.map((g) => ({ name: g.label, count: g.count }))}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#38a169" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
