import React, { useEffect, useState } from 'react';
import FormInput from '../../components/FormInput.jsx';
import ErrorMessage from '../../components/ErrorMessage.jsx';
import LoadingSpinner from '../../components/LoadingSpinner.jsx';
import ChangePasswordForm from '../../components/ChangePasswordForm.jsx';
import { getMyTeacherProfile, updateMyTeacherProfile } from '../../api/teacherApi.js';
import { formatDate, fullName, initials, statusBadgeClass } from '../../utils/formatters.js';

export default function MyProfile() {
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getMyTeacherProfile().then(setTeacher).catch(setError).finally(() => setLoading(false));
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setTeacher((current) => ({ ...current, [name]: value }));
    setSaved(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const updated = await updateMyTeacherProfile({ email: teacher.email, phone: teacher.phone });
      setTeacher(updated);
      setSaved(true);
    } catch (err) {
      setError(err);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <LoadingSpinner label="Loading your profile..." />;
  if (error && !teacher) return <ErrorMessage error={error} />;
  if (!teacher) return <div className="alert alert-warning">Your login isn't linked to a faculty profile yet.</div>;

  return (
    <div>
      <h4 className="fw-bold mb-3">My Profile</h4>
      <div className="sms-card p-4 mb-3">
        <div className="d-flex align-items-center gap-3">
          <span className="sms-avatar-sm" style={{ width: 72, height: 72, fontSize: '1.5rem' }}>
            {initials(teacher.firstName, teacher.lastName)}
          </span>
          <div>
            <h4 className="fw-bold mb-1">{fullName(teacher.firstName, teacher.lastName)}</h4>
            <div className="text-muted small">Employee ID: {teacher.employeeId}</div>
            <div className="text-muted small">{teacher.designation || 'Faculty'} · {teacher.department?.departmentName || '-'}</div>
          </div>
        </div>
      </div>

      <div className="sms-card p-4 mb-3">
        <h6 className="fw-semibold text-muted mb-3">Faculty information</h6>
        <div className="row g-3">
          <Detail label="Department" value={teacher.department?.departmentName} />
          <Detail label="Designation" value={teacher.designation} />
          <Detail label="Joining date" value={formatDate(teacher.joiningDate)} />
          <div className="col-md-4">
            <div className="text-muted small">Status</div>
            <span className={`sms-badge-status ${statusBadgeClass(teacher.status)}`}>{teacher.status || '-'}</span>
          </div>
          <div className="col-12">
            <div className="text-muted small mb-1">Assigned courses</div>
            {teacher.courses?.length ? (
              <div className="d-flex flex-wrap gap-2">
                {teacher.courses.map((course) => (
                  <span className="badge text-bg-light border" key={course.id}>
                    {course.courseCode} · {course.courseName}
                  </span>
                ))}
              </div>
            ) : <div className="fw-semibold">No courses assigned</div>}
          </div>
        </div>
      </div>

      <div className="sms-card p-4">
        <h6 className="fw-semibold text-muted mb-3">Update contact information</h6>
        {error && <ErrorMessage error={error} />}
        {saved && <div className="alert alert-success">Profile updated successfully.</div>}
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <FormInput colClass="col-md-6" label="Email" name="email" type="email" value={teacher.email} onChange={handleChange} required />
            <FormInput colClass="col-md-6" label="Phone" name="phone" value={teacher.phone} onChange={handleChange} required />
          </div>
          <button type="submit" className="btn btn-primary mt-3" disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
      <ChangePasswordForm />
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
