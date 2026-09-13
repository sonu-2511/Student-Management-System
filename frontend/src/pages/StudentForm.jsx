import React, { useEffect, useState } from 'react';
import FormInput from '../components/FormInput.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import { getDepartments } from '../api/departmentApi.js';
import { getCourses } from '../api/courseApi.js';
import { validateStudentForm } from '../utils/validators.js';

const GENDER_OPTIONS = [
  { value: 'MALE', label: 'Male' },
  { value: 'FEMALE', label: 'Female' },
  { value: 'OTHER', label: 'Other' }
];

const STATUS_OPTIONS = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'INACTIVE', label: 'Inactive' },
  { value: 'GRADUATED', label: 'Graduated' },
  { value: 'SUSPENDED', label: 'Suspended' }
];

const EMPTY_FORM = {
  rollNumber: '', username: '', password: '', firstName: '', lastName: '', email: '', phone: '',
  dateOfBirth: '', gender: '', address: '', city: '', state: '', pincode: '',
  admissionDate: '', departmentId: '', courseId: '', semester: '', status: 'ACTIVE', profileImage: ''
};

export default function StudentForm({ initialValues, onSubmit, submitLabel = 'Save', submitError }) {
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
    if (initialValues) {
      setForm((f) => ({ ...f, ...initialValues }));
    }
  }, [initialValues]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validateStudentForm(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setSubmitting(true);
    try {
      await onSubmit({
        ...form,
        semester: Number(form.semester),
        departmentId: form.departmentId || null,
        courseId: form.courseId || null
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {submitError && <ErrorMessage error={submitError} />}

      <h6 className="fw-semibold text-muted mb-3">Personal Information</h6>
      <div className="row g-3 mb-4">
        <FormInput colClass="col-md-6" label="First Name" name="firstName" value={form.firstName} onChange={handleChange} error={errors.firstName} required />
        <FormInput colClass="col-md-6" label="Last Name" name="lastName" value={form.lastName} onChange={handleChange} error={errors.lastName} required />
        <FormInput colClass="col-md-4" label="Date of Birth" name="dateOfBirth" type="date" value={form.dateOfBirth} onChange={handleChange} error={errors.dateOfBirth} required />
        <FormInput colClass="col-md-4" label="Gender" name="gender" as="select" options={GENDER_OPTIONS} value={form.gender} onChange={handleChange} error={errors.gender} required />
        <FormInput colClass="col-md-4" label="Email" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} required />
        <FormInput colClass="col-md-6" label="Phone" name="phone" value={form.phone} onChange={handleChange} error={errors.phone} required />
        <FormInput colClass="col-md-6" label="Profile Image URL" name="profileImage" value={form.profileImage} onChange={handleChange} placeholder="https://..." />
      </div>

      <h6 className="fw-semibold text-muted mb-3">Address</h6>
      <div className="row g-3 mb-4">
        <FormInput colClass="col-12" label="Address" name="address" value={form.address} onChange={handleChange} />
        <FormInput colClass="col-md-4" label="City" name="city" value={form.city} onChange={handleChange} />
        <FormInput colClass="col-md-4" label="State" name="state" value={form.state} onChange={handleChange} />
        <FormInput colClass="col-md-4" label="Pincode" name="pincode" value={form.pincode} onChange={handleChange} />
      </div>

      <h6 className="fw-semibold text-muted mb-3">Academic Information</h6>
      <div className="row g-3 mb-4">
        <FormInput colClass="col-md-4" label="Roll Number" name="rollNumber" value={form.rollNumber} onChange={handleChange} error={errors.rollNumber} required />
        <FormInput colClass="col-md-4" label="Student Username" name="username" value={form.username} onChange={handleChange} error={errors.username} required />
        <FormInput colClass="col-md-4" label="Student Password" name="password" type="password" value={form.password} onChange={handleChange} error={errors.password} required />
        <FormInput
          colClass="col-md-4"
          label="Department"
          name="departmentId"
          as="select"
          options={departments.map((d) => ({ value: d.id, label: d.departmentName }))}
          value={form.departmentId}
          onChange={handleChange}
        />
        <FormInput
          colClass="col-md-4"
          label="Course"
          name="courseId"
          as="select"
          options={courses.map((c) => ({ value: c.id, label: c.courseName }))}
          value={form.courseId}
          onChange={handleChange}
        />
        <FormInput colClass="col-md-4" label="Semester" name="semester" type="number" value={form.semester} onChange={handleChange} error={errors.semester} required />
        <FormInput colClass="col-md-4" label="Admission Date" name="admissionDate" type="date" value={form.admissionDate} onChange={handleChange} error={errors.admissionDate} required />
        <FormInput colClass="col-md-4" label="Status" name="status" as="select" options={STATUS_OPTIONS} value={form.status} onChange={handleChange} error={errors.status} required />
      </div>

      <button type="submit" className="btn btn-primary px-4" disabled={submitting}>
        {submitting ? 'Saving...' : submitLabel}
      </button>
    </form>
  );
}
