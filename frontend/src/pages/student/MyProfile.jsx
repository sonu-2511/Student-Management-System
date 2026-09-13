import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth.js';
import LoadingSpinner from '../../components/LoadingSpinner.jsx';
import ErrorMessage from '../../components/ErrorMessage.jsx';
import { getMyStudentProfile, updateMyStudentProfile } from '../../api/studentApi.js';
import FormInput from '../../components/FormInput.jsx';
import ChangePasswordForm from '../../components/ChangePasswordForm.jsx';
import { formatDate, fullName, initials, statusBadgeClass } from '../../utils/formatters.js';

export default function MyProfile() {
  const { studentId } = useAuth();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!studentId) { setLoading(false); return; }
    getMyStudentProfile().then(setStudent).catch(setError).finally(() => setLoading(false));
  }, [studentId]);

  if (!studentId) return <div className="alert alert-warning">Your login isn't linked to a student profile yet.</div>;
  if (loading) return <LoadingSpinner label="Loading your profile..." />;
  if (error) return <ErrorMessage error={error} />;
  if (!student) return null;

  function handleChange(e) {
    const { name, value } = e.target;
    setStudent((current) => ({ ...current, [name]: value }));
    setSaved(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const updated = await updateMyStudentProfile({
        email: student.email,
        phone: student.phone,
        address: student.address,
        city: student.city,
        state: student.state,
        pincode: student.pincode,
        profileImage: student.profileImage
      });
      setStudent(updated);
      setSaved(true);
    } catch (err) {
      setError(err);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <h4 className="fw-bold mb-3">My Profile</h4>

      <div className="sms-card p-4 mb-3">
        <div className="d-flex align-items-center gap-3 flex-wrap">
          {student.profileImage ? (
            <img src={student.profileImage} alt="" className="sms-avatar-sm" style={{ width: 72, height: 72, fontSize: '1.5rem' }} />
          ) : (
            <span className="sms-avatar-sm" style={{ width: 72, height: 72, fontSize: '1.5rem' }}>
              {initials(student.firstName, student.lastName)}
            </span>
          )}
          <div>
            <h4 className="fw-bold mb-1">{fullName(student.firstName, student.lastName)}</h4>
            <div className="text-muted small">Roll No. {student.rollNumber} &middot; {student.email} &middot; {student.phone}</div>
            <div className="mt-2 d-flex gap-3 flex-wrap small">
              <span><strong>Department:</strong> {student.department?.departmentName || '-'}</span>
              <span><strong>Course:</strong> {student.course?.courseName || '-'}</span>
              <span><strong>Semester:</strong> {student.semester}</span>
              <span><strong>Admitted:</strong> {formatDate(student.admissionDate)}</span>
              <span className={`sms-badge-status ${statusBadgeClass(student.status)}`}>{student.status}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="sms-card p-4">
        <h6 className="fw-semibold text-muted mb-3">Update contact information</h6>
        {error && <ErrorMessage error={error} />}
        {saved && <div className="alert alert-success">Profile updated successfully.</div>}
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <FormInput colClass="col-md-6" label="Email" name="email" type="email" value={student.email} onChange={handleChange} required />
            <FormInput colClass="col-md-6" label="Phone" name="phone" value={student.phone} onChange={handleChange} required />
            <FormInput colClass="col-12" label="Address" name="address" as="textarea" value={student.address} onChange={handleChange} />
            <FormInput colClass="col-md-4" label="City" name="city" value={student.city} onChange={handleChange} />
            <FormInput colClass="col-md-4" label="State" name="state" value={student.state} onChange={handleChange} />
            <FormInput colClass="col-md-4" label="Pincode" name="pincode" value={student.pincode} onChange={handleChange} />
            <FormInput colClass="col-12" label="Profile Image URL" name="profileImage" value={student.profileImage} onChange={handleChange} placeholder="https://..." />
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
