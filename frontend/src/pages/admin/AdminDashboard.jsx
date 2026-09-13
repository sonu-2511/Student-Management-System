import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import DashboardCard from '../../components/DashboardCard.jsx';
import LoadingSpinner from '../../components/LoadingSpinner.jsx';
import ErrorMessage from '../../components/ErrorMessage.jsx';
import {
  getDashboardSummary, getStudentsByDepartmentReport, getGradeDistributionReport, getAtRiskStudents
} from '../../api/dashboardApi.js';
import { downloadCsv } from '../../utils/downloads.js';

const PIE_COLORS = ['#2c5282', '#3182ce', '#38a169', '#dd6b20', '#805ad5', '#e53e3e', '#319795'];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [byDepartment, setByDepartment] = useState([]);
  const [gradeDistribution, setGradeDistribution] = useState([]);
  const [atRiskStudents, setAtRiskStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [summaryData, deptData, gradeData, riskData] = await Promise.all([
          getDashboardSummary(),
          getStudentsByDepartmentReport(),
          getGradeDistributionReport(),
          getAtRiskStudents()
        ]);
        if (!cancelled) {
          setSummary(summaryData);
          setByDepartment(deptData);
          setGradeDistribution(gradeData);
          setAtRiskStudents(riskData);
        }
      } catch (err) {
        if (!cancelled) setError(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  function handleNewIntake() {
    navigate('/admin/students/add');
  }

  function handleDownloadReport() {
    if (!summary) return;

    const rows = [
      ['Metric', 'Value'],
      ['Total Students', summary.totalStudents ?? 0],
      ['Total Teachers', summary.totalTeachers ?? 0],
      ['Total Courses', summary.totalCourses ?? 0],
      ['Departments', summary.totalDepartments ?? 0],
      ['Present Today', summary.presentStudentsToday ?? 0],
      ['Average Attendance', `${summary.averageAttendancePercentage ?? 0}%`],
      ['Average Marks', summary.averageMarks ?? 0],
      ...byDepartment.map((item) => [`Students in ${item.label}`, item.count]),
      ...gradeDistribution.map((item) => [`Grade ${item.label}`, item.count])
    ];

    downloadCsv('northstar-campus-report.csv', ['Metric', 'Value'], rows);
  }

  if (loading) return <LoadingSpinner label="Loading dashboard..." />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div>
      <div className="sms-hero-panel mb-4">
        <div>
          <div className="sms-hero-kicker">Institution overview</div>
          <h3 className="fw-bold mb-2">Welcome back to NorthStar Campus</h3>
          <p className="mb-0">Track enrollment, learner performance, and operations from a single control center.</p>
        </div>

        <div className="sms-hero-actions">
          <button className="btn btn-light btn-sm" onClick={handleNewIntake}>
            <i className="bi bi-plus-circle me-2" />New intake
          </button>
          <button className="btn btn-outline-light btn-sm" onClick={handleDownloadReport}>
            <i className="bi bi-file-earmark-bar-graph me-2" />Download report
          </button>
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3">
          <DashboardCard label="Total Students" value={summary.totalStudents} icon="bi-people-fill" variant="primary" />
        </div>
        <div className="col-6 col-md-3">
          <DashboardCard label="Total Teachers" value={summary.totalTeachers} icon="bi-person-workspace" variant="info" />
        </div>
        <div className="col-6 col-md-3">
          <DashboardCard label="Total Courses" value={summary.totalCourses} icon="bi-journal-bookmark" variant="purple" />
        </div>
        <div className="col-6 col-md-3">
          <DashboardCard label="Departments" value={summary.totalDepartments} icon="bi-diagram-3" variant="warning" />
        </div>
        <div className="col-6 col-md-3">
          <DashboardCard label="Present Today" value={summary.presentStudentsToday} icon="bi-calendar-check" variant="success" />
        </div>
        <div className="col-6 col-md-3">
          <DashboardCard
            label="Avg. Attendance"
            value={`${summary.averageAttendancePercentage}%`}
            icon="bi-graph-up"
            variant="info"
          />
        </div>
        <div className="col-6 col-md-3">
          <DashboardCard label="Average Marks" value={summary.averageMarks} icon="bi-clipboard-data" variant="primary" />
        </div>
      </div>

      <div className="row g-3">
        <div className="col-lg-7">
          <div className="sms-card p-3">
            <h6 className="fw-semibold mb-3">Students by Department</h6>
            {byDepartment.length === 0 ? (
              <p className="text-muted small mb-0">No data yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={byDepartment.map((d) => ({ name: d.label, count: d.count }))}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#2c5282" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="col-lg-5">
          <div className="sms-card p-3">
            <h6 className="fw-semibold mb-3">Grade Distribution</h6>
            {gradeDistribution.length === 0 ? (
              <p className="text-muted small mb-0">No marks recorded yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={gradeDistribution.map((g) => ({ name: g.label, value: g.count }))}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label
                  >
                    {gradeDistribution.map((_, index) => (
                      <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      <div className="row g-3 mt-1">
        <div className="col-12">
          <div className="sms-card p-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="fw-semibold mb-0">At-risk students</h6>
              <span className="badge bg-warning text-dark">Smart intervention</span>
            </div>

            {atRiskStudents.length === 0 ? (
              <p className="text-muted small mb-0">No critical student alerts at the moment.</p>
            ) : (
              <div className="list-group list-group-flush">
                {atRiskStudents.map((student) => (
                  <div key={student.studentId} className="list-group-item px-0">
                    <div className="d-flex justify-content-between align-items-start gap-3">
                      <div>
                        <div className="fw-semibold">{student.studentName}</div>
                        <div className="small text-muted">{student.rollNumber} • {student.departmentName} • Semester {student.semester}</div>
                        <div className="small text-muted mt-1">Attendance: {student.attendancePercentage}% • Avg marks: {student.averageMarks}</div>
                      </div>
                      <span className={`badge ${student.priority === 'HIGH' ? 'bg-danger' : student.priority === 'MEDIUM' ? 'bg-warning text-dark' : 'bg-secondary'}`}>
                        {student.priority}
                      </span>
                    </div>
                    <div className="mt-2 d-flex flex-wrap gap-2">
                      {student.reasons.map((reason, index) => (
                        <span key={`${student.studentId}-${index}`} className="badge bg-light text-dark border">{reason}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
