import React from 'react';
import { Link } from 'react-router-dom';
import Announcements from '../../components/Announcements.jsx';

export default function TeacherDashboard() {
  return (
    <div>
      <Announcements />
      <h4 className="fw-bold mb-4">Welcome back 👋</h4>
      <div className="row g-3">
        <div className="col-md-4">
          <Link to="/teacher/students" className="text-decoration-none">
            <div className="sms-card p-4 h-100">
              <i className="bi bi-people fs-2 text-primary" />
              <h6 className="fw-semibold mt-2 mb-1">My Students</h6>
              <p className="text-muted small mb-0">View students enrolled in your courses.</p>
            </div>
          </Link>
        </div>
        <div className="col-md-4">
          <Link to="/teacher/attendance" className="text-decoration-none">
            <div className="sms-card p-4 h-100">
              <i className="bi bi-calendar-check fs-2 text-success" />
              <h6 className="fw-semibold mt-2 mb-1">Mark Attendance</h6>
              <p className="text-muted small mb-0">Record daily attendance for your courses.</p>
            </div>
          </Link>
        </div>
        <div className="col-md-4">
          <Link to="/teacher/marks" className="text-decoration-none">
            <div className="sms-card p-4 h-100">
              <i className="bi bi-clipboard-data fs-2 text-warning" />
              <h6 className="fw-semibold mt-2 mb-1">Record Marks</h6>
              <p className="text-muted small mb-0">Enter and update student marks and grades.</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
