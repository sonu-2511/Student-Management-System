import React, { useEffect, useState } from 'react';
import FormInput from '../components/FormInput.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import { getDepartments } from '../api/departmentApi.js';
import { getCourses } from '../api/courseApi.js';
import { validateTeacherForm } from '../utils/validators.js';

const STATUS_OPTIONS = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'INACTIVE', label: 'Inactive' },
  { value: 'SUSPENDED', label: 'Suspended' }
];

const EMPTY_FORM = {
  employeeId: '', username: '', password: '', firstName: '', lastName: '', email: '', phone: '',
  departmentId: '', designation: '', joiningDate: '', status: 'ACTIVE', courseIds: []
};

export default function TeacherForm({ initialValues, onSubmit, submitLabel = 'Save', submitError }) {
  const [form, setForm] = useState({ ...EMPTY_FORM, ...initialValues });
  const [errors, setErrors] = useState({});
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getDepartments().then(setDepartments).catch(() => {});
    getCourses({ size: 100 }).then((res) => setCourses(res.content)).catch(() => {});
  }, []);

  useEffect(() => {
    if (initialValues) setForm((f) => ({ ...f, ...initialValues }));
  }, [initialValues]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function handleCourseToggle(courseId) {
    setForm((f) => {
      const has = f.courseIds.includes(courseId);
      return {
        ...f,
        courseIds: has ? f.courseIds.filter((id) => id !== courseId) : [...f.courseIds, courseId]
      };
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validateTeacherForm(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setSubmitting(true);
    try {
      await onSubmit({ ...form, departmentId: form.departmentId || null });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {submitError && <ErrorMessage error={submitError} />}

      <div className="row g-3 mb-4">
        <FormInput colClass="col-md-4" label="Employee ID" name="employeeId" value={form.employeeId} onChange={handleChange} error={errors.employeeId} required />
        <FormInput colClass="col-md-4" label="Faculty Username" name="username" value={form.username} onChange={handleChange} error={errors.username} required={!initialValues} />
        <FormInput colClass="col-md-4" label="Faculty Password" name="password" type="password" value={form.password} onChange={handleChange} error={errors.password} required={!initialValues} />
        <FormInput colClass="col-md-4" label="First Name" name="firstName" value={form.firstName} onChange={handleChange} error={errors.firstName} required />
        <FormInput colClass="col-md-4" label="Last Name" name="lastName" value={form.lastName} onChange={handleChange} error={errors.lastName} required />
        <FormInput colClass="col-md-4" label="Email" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} required />
        <FormInput colClass="col-md-4" label="Phone" name="phone" value={form.phone} onChange={handleChange} error={errors.phone} required />
        <FormInput
          colClass="col-md-4"
          label="Department"
          name="departmentId"
          as="select"
          options={departments.map((d) => ({ value: d.id, label: d.departmentName }))}
          value={form.departmentId}
          onChange={handleChange}
        />
        <FormInput colClass="col-md-4" label="Designation" name="designation" value={form.designation} onChange={handleChange} placeholder="e.g. Assistant Professor" />
        <FormInput colClass="col-md-4" label="Joining Date" name="joiningDate" type="date" value={form.joiningDate} onChange={handleChange} error={errors.joiningDate} required />
        <FormInput colClass="col-md-4" label="Status" name="status" as="select" options={STATUS_OPTIONS} value={form.status} onChange={handleChange} error={errors.status} required />
      </div>

      <h6 className="fw-semibold text-muted mb-2">Assigned Courses</h6>
      <div className="row g-2 mb-4">
        {courses.length === 0 && <p className="text-muted small">No courses available yet.</p>}
        {courses.map((c) => (
          <div className="col-md-4" key={c.id}>
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id={`course-${c.id}`}
                checked={form.courseIds.includes(c.id)}
                onChange={() => handleCourseToggle(c.id)}
              />
              <label className="form-check-label" htmlFor={`course-${c.id}`}>
                {c.courseName} ({c.courseCode})
              </label>
            </div>
          </div>
        ))}
      </div>

      <button type="submit" className="btn btn-primary px-4" disabled={submitting}>
        {submitting ? 'Saving...' : submitLabel}
      </button>
    </form>
  );
}
