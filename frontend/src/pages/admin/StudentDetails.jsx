import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import LoadingSpinner from '../../components/LoadingSpinner.jsx';
import ErrorMessage from '../../components/ErrorMessage.jsx';
import DataTable from '../../components/DataTable.jsx';
import { getStudentById } from '../../api/studentApi.js';
import { getAttendanceByStudent } from '../../api/attendanceApi.js';
import { getMarksByStudent } from '../../api/marksApi.js';
import { formatDate, fullName, initials, statusBadgeClass, gradeBadgeClass } from '../../utils/formatters.js';

const TABS = ['Personal Information', 'Academic Information', 'Attendance', 'Marks', 'Courses'];

export default function StudentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(TABS[0]);

  const [attendance, setAttendance] = useState(null);
  const [marks, setMarks] = useState(null);
  const [tabLoading, setTabLoading] = useState(false);

  useEffect(() => {
    getStudentById(id).then(setStudent).catch(setError).finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (activeTab === 'Attendance' && !attendance) {
      setTabLoading(true);
      getAttendanceByStudent(id, { size: 20 }).then(setAttendance).catch(setError).finally(() => setTabLoading(false));
    }
    if ((activeTab === 'Marks' || activeTab === 'Courses') && !marks) {
      setTabLoading(true);
      getMarksByStudent(id, { size: 50 }).then(setMarks).catch(setError).finally(() => setTabLoading(false));
    }
  }, [activeTab, id, attendance, marks]);

  if (loading) return <LoadingSpinner label="Loading student profile..." />;
  if (error) return <ErrorMessage error={error} />;
  if (!student) return null;

  return (
    <div>
      <button className="btn btn-link px-0 mb-2 text-decoration-none" onClick={() => navigate('/admin/students')}>
        <i className="bi bi-arrow-left me-1" /> Back to Students
      </button>

      <div className="sms-card p-4 mb-3">
        <div className="d-flex align-items-center gap-3 flex-wrap">
          {student.profileImage ? (
            <img src={student.profileImage} alt="" className="sms-avatar-sm" style={{ width: 72, height: 72, fontSize: '1.5rem' }} />
          ) : (
            <span className="sms-avatar-sm" style={{ width: 72, height: 72, fontSize: '1.5rem' }}>
              {initials(student.firstName, student.lastName)}
            </span>
          )}
          <div className="flex-grow-1">
            <h4 className="fw-bold mb-1">{fullName(student.firstName, student.lastName)}</h4>
            <div className="text-muted small">
              Roll No. {student.rollNumber} &middot; {student.email} &middot; {student.phone}
            </div>
            <div className="mt-2 d-flex gap-3 flex-wrap small">
              <span><strong>Department:</strong> {student.department?.departmentName || '-'}</span>
              <span><strong>Course:</strong> {student.course?.courseName || '-'}</span>
              <span><strong>Semester:</strong> {student.semester}</span>
              <span><strong>Admitted:</strong> {formatDate(student.admissionDate)}</span>
              <span className={`sms-badge-status ${statusBadgeClass(student.status)}`}>{student.status}</span>
            </div>
          </div>
          <Link to={`/admin/students/${id}/edit`} className="btn btn-outline-primary">
            <i className="bi bi-pencil me-1" /> Edit
          </Link>
        </div>
      </div>

      <ul className="nav nav-tabs mb-3">
        {TABS.map((tab) => (
          <li className="nav-item" key={tab}>
            <button
              className={`nav-link ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          </li>
        ))}
      </ul>

      <div className="sms-card p-4">
        {activeTab === 'Personal Information' && (
          <div className="row g-3">
            <Detail label="First Name" value={student.firstName} />
            <Detail label="Last Name" value={student.lastName} />
            <Detail label="Date of Birth" value={formatDate(student.dateOfBirth)} />
            <Detail label="Gender" value={student.gender} />
            <Detail label="Email" value={student.email} />
            <Detail label="Phone" value={student.phone} />
            <Detail label="Address" value={student.address} />
            <Detail label="City" value={student.city} />
            <Detail label="State" value={student.state} />
            <Detail label="Pincode" value={student.pincode} />
          </div>
        )}

        {activeTab === 'Academic Information' && (
          <div className="row g-3">
            <Detail label="Roll Number" value={student.rollNumber} />
            <Detail label="Department" value={student.department?.departmentName} />
            <Detail label="Course" value={student.course?.courseName} />
            <Detail label="Semester" value={student.semester} />
            <Detail label="Admission Date" value={formatDate(student.admissionDate)} />
            <Detail label="Status" value={student.status} />
          </div>
        )}

        {activeTab === 'Attendance' && (
          <DataTable
            loading={tabLoading}
            rows={attendance?.content}
            emptyMessage="No attendance records yet."
            columns={[
              { key: 'date', label: 'Date', render: (r) => formatDate(r.date) },
              { key: 'course', label: 'Course', render: (r) => r.course.courseName },
              { key: 'status', label: 'Status', render: (r) => <span className={`sms-badge-status ${statusBadgeClass(r.status)}`}>{r.status}</span> },
              { key: 'remarks', label: 'Remarks' }
            ]}
          />
        )}

        {activeTab === 'Marks' && (
          <DataTable
            loading={tabLoading}
            rows={marks?.content}
            emptyMessage="No marks recorded yet."
            columns={[
              { key: 'course', label: 'Course', render: (r) => r.course.courseName },
              { key: 'internalMarks', label: 'Internal' },
              { key: 'assignmentMarks', label: 'Assignment' },
              { key: 'practicalMarks', label: 'Practical' },
              { key: 'examMarks', label: 'Exam' },
              { key: 'totalMarks', label: 'Total' },
              { key: 'grade', label: 'Grade', render: (r) => <span className={`sms-badge-status ${gradeBadgeClass(r.grade)}`}>{r.grade}</span> }
            ]}
          />
        )}

        {activeTab === 'Courses' && (
          <DataTable
            loading={tabLoading}
            rows={marks?.content}
            keyField="id"
            emptyMessage="No enrolled courses with recorded marks yet."
            columns={[
              { key: 'course', label: 'Course', render: (r) => r.course.courseName },
              { key: 'code', label: 'Code', render: (r) => r.course.courseCode }
            ]}
          />
        )}
      </div>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div className="col-md-4">
      <div className="text-muted small">{label}</div>
      <div className="fw-semibold">{value || '-'}</div>
    </div>
  );
}
