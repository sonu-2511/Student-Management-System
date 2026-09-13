import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import StudentForm from '../StudentForm.jsx';
import LoadingSpinner from '../../components/LoadingSpinner.jsx';
import ErrorMessage from '../../components/ErrorMessage.jsx';
import { getStudentById, updateStudent } from '../../api/studentApi.js';

export default function EditStudent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    getStudentById(id)
      .then((data) =>
        setStudent({
          ...data,
          departmentId: data.department?.id || '',
          courseId: data.course?.id || ''
        })
      )
      .catch(setLoadError)
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSubmit(payload) {
    setSubmitError(null);
    try {
      await updateStudent(id, payload);
      navigate(`/admin/students/${id}`, { replace: true });
    } catch (err) {
      setSubmitError(err);
    }
  }

  if (loading) return <LoadingSpinner label="Loading student..." />;
  if (loadError) return <ErrorMessage error={loadError} />;

  return (
    <div>
      <h4 className="fw-bold mb-3">Edit Student</h4>
      <div className="sms-card p-4">
        <StudentForm initialValues={student} onSubmit={handleSubmit} submitLabel="Save Changes" submitError={submitError} />
      </div>
    </div>
  );
}
