import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from '../../components/DataTable.jsx';
import SearchBar from '../../components/SearchBar.jsx';
import Pagination from '../../components/Pagination.jsx';
import ErrorMessage from '../../components/ErrorMessage.jsx';
import ConfirmDialog from '../../components/ConfirmDialog.jsx';
import { getStudents, searchStudents, deleteStudent } from '../../api/studentApi.js';
import { getDepartments } from '../../api/departmentApi.js';
import { getCourses } from '../../api/courseApi.js';
import { initials, fullName, statusBadgeClass } from '../../utils/formatters.js';

const STATUS_OPTIONS = ['ACTIVE', 'INACTIVE', 'GRADUATED', 'SUSPENDED'];

export default function StudentList() {
  const navigate = useNavigate();

  const [students, setStudents] = useState({ content: [], page: 0, totalPages: 0, totalElements: 0 });
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [filters, setFilters] = useState({ departmentId: '', courseId: '', semester: '', status: '' });
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    getDepartments().then(setDepartments).catch(() => {});
    getCourses({ size: 100 }).then((res) => setCourses(res.content)).catch(() => {});
  }, []);

  const loadStudents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { page, size: 10 };
      let data;
      if (keyword) {
        data = await searchStudents(keyword, params);
      } else {
        Object.entries(filters).forEach(([k, v]) => {
          if (v !== '') params[k] = v;
        });
        data = await getStudents(params);
      }
      setStudents(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [page, keyword, filters]);

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  function handleFilterChange(field, value) {
    setKeyword('');
    setPage(0);
    setFilters((f) => ({ ...f, [field]: value }));
  }

  function handleSearch(value) {
    setPage(0);
    setKeyword(value);
  }

  async function confirmDelete() {
    setDeleting(true);
    try {
      await deleteStudent(pendingDelete.id);
      setPendingDelete(null);
      await loadStudents();
    } catch (err) {
      setError(err);
    } finally {
      setDeleting(false);
    }
  }

  const columns = [
    {
      key: 'profile',
      label: 'Profile',
      render: (row) =>
        row.profileImage ? (
          <img src={row.profileImage} alt="" className="sms-avatar-sm" />
        ) : (
          <span className="sms-avatar-sm">{initials(row.firstName, row.lastName)}</span>
        )
    },
    { key: 'rollNumber', label: 'Roll Number' },
    { key: 'name', label: 'Name', render: (row) => fullName(row.firstName, row.lastName) },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'department', label: 'Department', render: (row) => row.department?.departmentName || '-' },
    { key: 'course', label: 'Course', render: (row) => row.course?.courseName || '-' },
    { key: 'semester', label: 'Semester' },
    {
      key: 'status',
      label: 'Status',
      render: (row) => <span className={`sms-badge-status ${statusBadgeClass(row.status)}`}>{row.status}</span>
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="d-flex gap-1">
          <button
            className="btn btn-sm btn-outline-secondary"
            title="View"
            onClick={(e) => { e.stopPropagation(); navigate(`/admin/students/${row.id}`); }}
          >
            <i className="bi bi-eye" />
          </button>
          <button
            className="btn btn-sm btn-outline-primary"
            title="Edit"
            onClick={(e) => { e.stopPropagation(); navigate(`/admin/students/${row.id}/edit`); }}
          >
            <i className="bi bi-pencil" />
          </button>
          <button
            className="btn btn-sm btn-outline-danger"
            title="Delete"
            onClick={(e) => { e.stopPropagation(); setPendingDelete(row); }}
          >
            <i className="bi bi-trash" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <h4 className="fw-bold mb-0">Students</h4>
        <button className="btn btn-primary" onClick={() => navigate('/admin/students/add')}>
          <i className="bi bi-plus-lg me-1" /> Add Student
        </button>
      </div>

      {error && <ErrorMessage error={error} onDismiss={() => setError(null)} />}

      <div className="sms-card p-3 mb-3">
        <div className="row g-2 align-items-end">
          <div className="col-12 col-lg-4">
            <SearchBar placeholder="Search by name, email, roll number..." onSearch={handleSearch} />
          </div>
          <div className="col-6 col-lg-2">
            <select
              className="form-select"
              value={filters.departmentId}
              onChange={(e) => handleFilterChange('departmentId', e.target.value)}
            >
              <option value="">All Departments</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>{d.departmentName}</option>
              ))}
            </select>
          </div>
          <div className="col-6 col-lg-2">
            <select
              className="form-select"
              value={filters.courseId}
              onChange={(e) => handleFilterChange('courseId', e.target.value)}
            >
              <option value="">All Courses</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>{c.courseName}</option>
              ))}
            </select>
          </div>
          <div className="col-6 col-lg-2">
            <select
              className="form-select"
              value={filters.semester}
              onChange={(e) => handleFilterChange('semester', e.target.value)}
            >
              <option value="">All Semesters</option>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((s) => (
                <option key={s} value={s}>Semester {s}</option>
              ))}
            </select>
          </div>
          <div className="col-6 col-lg-2">
            <select
              className="form-select"
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="">All Statuses</option>
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="sms-card p-3">
        <DataTable
          columns={columns}
          rows={students.content}
          loading={loading}
          onRowClick={(row) => navigate(`/admin/students/${row.id}`)}
          emptyMessage="No students match your search/filters."
        />
        <Pagination
          page={students.page}
          totalPages={students.totalPages}
          totalElements={students.totalElements}
          onPageChange={setPage}
        />
      </div>

      <ConfirmDialog
        show={!!pendingDelete}
        title="Delete student"
        message={`Are you sure you want to delete ${pendingDelete ? fullName(pendingDelete.firstName, pendingDelete.lastName) : ''}? This cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
        busy={deleting}
      />
    </div>
  );
}
