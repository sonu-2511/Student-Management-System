import React, { useCallback, useEffect, useState } from 'react';
import DataTable from '../../components/DataTable.jsx';
import Modal from '../../components/Modal.jsx';
import ConfirmDialog from '../../components/ConfirmDialog.jsx';
import ErrorMessage from '../../components/ErrorMessage.jsx';
import FormInput from '../../components/FormInput.jsx';
import Pagination from '../../components/Pagination.jsx';
import { getCourses, createCourse, updateCourse, deleteCourse } from '../../api/courseApi.js';
import { getDepartments } from '../../api/departmentApi.js';

const EMPTY_FORM = { courseCode: '', courseName: '', credits: '', semester: '', departmentId: '' };

export default function CourseList() {
  const [courses, setCourses] = useState({ content: [], page: 0, totalPages: 0, totalElements: 0 });
  const [departments, setDepartments] = useState([]);
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    getDepartments().then(setDepartments).catch(() => {});
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { page, size: 10 };
      if (departmentFilter) params.departmentId = departmentFilter;
      setCourses(await getCourses(params));
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [page, departmentFilter]);

  useEffect(() => { load(); }, [load]);

  function openAddModal() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setFormError(null);
    setShowModal(true);
  }

  function openEditModal(course) {
    setEditing(course);
    setForm({
      courseCode: course.courseCode,
      courseName: course.courseName,
      credits: course.credits,
      semester: course.semester,
      departmentId: course.department.id
    });
    setFormError(null);
    setShowModal(true);
  }

  async function handleSave() {
    setSaving(true);
    setFormError(null);
    try {
      const payload = { ...form, credits: Number(form.credits), semester: Number(form.semester) };
      if (editing) {
        await updateCourse(editing.id, payload);
      } else {
        await createCourse(payload);
      }
      setShowModal(false);
      await load();
    } catch (err) {
      setFormError(err);
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    setDeleting(true);
    try {
      await deleteCourse(pendingDelete.id);
      setPendingDelete(null);
      await load();
    } catch (err) {
      setError(err);
    } finally {
      setDeleting(false);
    }
  }

  const columns = [
    { key: 'courseCode', label: 'Code' },
    { key: 'courseName', label: 'Name' },
    { key: 'credits', label: 'Credits' },
    { key: 'semester', label: 'Semester' },
    { key: 'department', label: 'Department', render: (row) => row.department.departmentName },
    {
      key: 'actions', label: 'Actions',
      render: (row) => (
        <div className="d-flex gap-1">
          <button className="btn btn-sm btn-outline-primary" onClick={() => openEditModal(row)}>
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
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <h4 className="fw-bold mb-0">Courses</h4>
        <button className="btn btn-primary" onClick={openAddModal}>
          <i className="bi bi-plus-lg me-1" /> Add Course
        </button>
      </div>

      {error && <ErrorMessage error={error} onDismiss={() => setError(null)} />}

      <div className="sms-card p-3 mb-3">
        <div className="col-md-3">
          <select className="form-select" value={departmentFilter} onChange={(e) => { setPage(0); setDepartmentFilter(e.target.value); }}>
            <option value="">All Departments</option>
            {departments.map((d) => <option key={d.id} value={d.id}>{d.departmentName}</option>)}
          </select>
        </div>
      </div>

      <div className="sms-card p-3">
        <DataTable columns={columns} rows={courses.content} loading={loading} emptyMessage="No courses found." />
        <Pagination page={courses.page} totalPages={courses.totalPages} totalElements={courses.totalElements} onPageChange={setPage} />
      </div>

      <Modal
        show={showModal}
        title={editing ? 'Edit Course' : 'Add Course'}
        onClose={() => setShowModal(false)}
        footer={
          <>
            <button className="btn btn-outline-secondary" onClick={() => setShowModal(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </button>
          </>
        }
      >
        {formError && <ErrorMessage error={formError} />}
        <div className="row g-3">
          <FormInput colClass="col-md-6" label="Course Code" name="courseCode" value={form.courseCode}
            onChange={(e) => setForm((f) => ({ ...f, courseCode: e.target.value }))} required />
          <FormInput colClass="col-md-6" label="Course Name" name="courseName" value={form.courseName}
            onChange={(e) => setForm((f) => ({ ...f, courseName: e.target.value }))} required />
          <FormInput colClass="col-md-4" label="Credits" name="credits" type="number" value={form.credits}
            onChange={(e) => setForm((f) => ({ ...f, credits: e.target.value }))} required />
          <FormInput colClass="col-md-4" label="Semester" name="semester" type="number" value={form.semester}
            onChange={(e) => setForm((f) => ({ ...f, semester: e.target.value }))} required />
          <FormInput
            colClass="col-md-4" label="Department" name="departmentId" as="select"
            options={departments.map((d) => ({ value: d.id, label: d.departmentName }))}
            value={form.departmentId}
            onChange={(e) => setForm((f) => ({ ...f, departmentId: e.target.value }))}
            required
          />
        </div>
      </Modal>

      <ConfirmDialog
        show={!!pendingDelete}
        title="Delete course"
        message={`Delete course "${pendingDelete?.courseName}"?`}
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
        busy={deleting}
      />
    </div>
  );
}
