import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth.js';
import DashboardCard from '../../components/DashboardCard.jsx';
import LoadingSpinner from '../../components/LoadingSpinner.jsx';
import ErrorMessage from '../../components/ErrorMessage.jsx';
import { getStudentById } from '../../api/studentApi.js';
import { getAttendanceByStudent } from '../../api/attendanceApi.js';
import { getMarksByStudent } from '../../api/marksApi.js';
import { fullName } from '../../utils/formatters.js';
import Announcements from '../../components/Announcements.jsx';

export default function StudentDashboard() {
  const { studentId } = useAuth();
  const [student, setStudent] = useState(null);
  const [attendanceSummary, setAttendanceSummary] = useState(null);
  const [marksSummary, setMarksSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!studentId) {
      setLoading(false);
      return;
    }
    Promise.all([
      getStudentById(studentId),
      getAttendanceByStudent(studentId, { size: 200 }),
      getMarksByStudent(studentId, { size: 200 })
    ])
      .then(([studentData, attendanceData, marksData]) => {
        setStudent(studentData);

        const total = attendanceData.content.length;
        const present = attendanceData.content.filter((a) => a.status === 'PRESENT').length;
        setAttendanceSummary({ total, present, percentage: total ? Math.round((present / total) * 100) : 0 });

        const marksList = marksData.content;
        const avg = marksList.length
          ? (marksList.reduce((sum, m) => sum + Number(m.totalMarks), 0) / marksList.length).toFixed(1)
          : 0;
        setMarksSummary({ courses: marksList.length, average: avg });
      })
      .catch(setError)
      .finally(() => setLoading(false));
  }, [studentId]);

  if (!studentId) {
    return (
      <div className="alert alert-warning">
        Your login isn't linked to a student profile yet. Ask an administrator to link your account
        (User Management &rarr; link a Student ID to your username).
      </div>
    );
  }

  if (loading) return <LoadingSpinner label="Loading your dashboard..." />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div>
      <Announcements />
      <h4 className="fw-bold mb-4">Welcome, {student ? fullName(student.firstName, student.lastName) : ''} 👋</h4>

      <div className="row g-3">
        <div className="col-md-4">
          <DashboardCard label="Semester" value={student?.semester} icon="bi-mortarboard" variant="primary" />
        </div>
        <div className="col-md-4">
          <DashboardCard label="Attendance" value={`${attendanceSummary?.percentage ?? 0}%`} icon="bi-calendar-check" variant="success" />
        </div>
        <div className="col-md-4">
          <DashboardCard label="Average Marks" value={marksSummary?.average ?? 0} icon="bi-clipboard-data" variant="info" />
        </div>
      </div>
    </div>
  );
}
