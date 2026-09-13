import React, { useCallback, useEffect, useState } from 'react';
import DataTable from '../../components/DataTable.jsx';
import Modal from '../../components/Modal.jsx';
import ConfirmDialog from '../../components/ConfirmDialog.jsx';
import ErrorMessage from '../../components/ErrorMessage.jsx';
import FormInput from '../../components/FormInput.jsx';
import { getDepartments, createDepartment, updateDepartment, deleteDepartment } from '../../api/departmentApi.js';

const EMPTY_FORM = { departmentCode: '', departmentName: '', description: '' };

export default function DepartmentList() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setDepartments(await getDepartments());
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  function openAddModal() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setFormError(null);
    setShowModal(true);
  }

  function openEditModal(dept) {
    setEditing(dept);
    setForm({ departmentCode: dept.departmentCode, departmentName: dept.departmentName, description: dept.description || '' });
    setFormError(null);
    setShowModal(true);
  }

  async function handleSave() {
    setSaving(true);
    setFormError(null);
    try {
      if (editing) {
        await updateDepartment(editing.id, form);
      } else {
        await createDepartment(form);
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
      await deleteDepartment(pendingDelete.id);
      setPendingDelete(null);
      await load();
    } catch (err) {
      setError(err);
    } finally {
      setDeleting(false);
    }
  }

  const columns = [
    { key: 'departmentCode', label: 'Code' },
    { key: 'departmentName', label: 'Name' },
    { key: 'description', label: 'Description' },
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
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="fw-bold mb-0">Departments</h4>
        <button className="btn btn-primary" onClick={openAddModal}>
          <i className="bi bi-plus-lg me-1" /> Add Department
        </button>
      </div>

      {error && <ErrorMessage error={error} onDismiss={() => setError(null)} />}

      <div className="sms-card p-3">
        <DataTable columns={columns} rows={departments} loading={loading} emptyMessage="No departments yet." />
      </div>

      <Modal
        show={showModal}
        title={editing ? 'Edit Department' : 'Add Department'}
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
          <FormInput colClass="col-12" label="Department Code" name="departmentCode" value={form.departmentCode}
            onChange={(e) => setForm((f) => ({ ...f, departmentCode: e.target.value }))} required />
          <FormInput colClass="col-12" label="Department Name" name="departmentName" value={form.departmentName}
            onChange={(e) => setForm((f) => ({ ...f, departmentName: e.target.value }))} required />
          <FormInput colClass="col-12" label="Description" name="description" as="textarea" value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
        </div>
      </Modal>

      <ConfirmDialog
        show={!!pendingDelete}
        title="Delete department"
        message={`Delete department "${pendingDelete?.departmentName}"? Students/courses linked to it will need reassigning.`}
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
        busy={deleting}
      />
    </div>
  );
}
