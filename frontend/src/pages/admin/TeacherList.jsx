import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from '../../components/DataTable.jsx';
import Pagination from '../../components/Pagination.jsx';
import ErrorMessage from '../../components/ErrorMessage.jsx';
import ConfirmDialog from '../../components/ConfirmDialog.jsx';
import { getTeachers, deleteTeacher } from '../../api/teacherApi.js';
import { fullName, initials, statusBadgeClass, formatDate } from '../../utils/formatters.js';

export default function TeacherList() {
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState({ content: [], page: 0, totalPages: 0, totalElements: 0 });
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTeachers({ page, size: 10 });
      setTeachers(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { load(); }, [load]);

  async function confirmDelete() {
    setDeleting(true);
    try {
      await deleteTeacher(pendingDelete.id);
      setPendingDelete(null);
      await load();
    } catch (err) {
      setError(err);
    } finally {
      setDeleting(false);
    }
  }

  const columns = [
    {
      key: 'profile', label: 'Profile',
      render: (row) => <span className="sms-avatar-sm">{initials(row.firstName, row.lastName)}</span>
    },
    { key: 'employeeId', label: 'Employee ID' },
    { key: 'name', label: 'Name', render: (row) => fullName(row.firstName, row.lastName) },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'department', label: 'Department', render: (row) => row.department?.departmentName || '-' },
    { key: 'designation', label: 'Designation' },
    { key: 'joiningDate', label: 'Joined', render: (row) => formatDate(row.joiningDate) },
    {
      key: 'status', label: 'Status',
      render: (row) => <span className={`sms-badge-status ${statusBadgeClass(row.status)}`}>{row.status}</span>
    },
    {
      key: 'actions', label: 'Actions',
      render: (row) => (
        <div className="d-flex gap-1">
          <button className="btn btn-sm btn-outline-primary" onClick={() => navigate(`/admin/teachers/${row.id}/edit`)}>
            <i className="bi bi-pencil" />
          </button>
          <button className="btn btn-sm btn-outline-danger" onClick={() => setPendingDelete(row)}>
            <i className="bi bi-trash" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="fw-bold mb-0">Teachers</h4>
        <button className="btn btn-primary" onClick={() => navigate('/admin/teachers/add')}>
          <i className="bi bi-plus-lg me-1" /> Add Teacher
        </button>
      </div>

      {error && <ErrorMessage error={error} onDismiss={() => setError(null)} />}

      <div className="sms-card p-3">
        <DataTable columns={columns} rows={teachers.content} loading={loading} emptyMessage="No teachers found." />
        <Pagination page={teachers.page} totalPages={teachers.totalPages} totalElements={teachers.totalElements} onPageChange={setPage} />
      </div>

      <ConfirmDialog
        show={!!pendingDelete}
        title="Delete teacher"
        message={`Delete ${pendingDelete ? fullName(pendingDelete.firstName, pendingDelete.lastName) : ''}? This cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
        busy={deleting}
      />
    </div>
  );
}
