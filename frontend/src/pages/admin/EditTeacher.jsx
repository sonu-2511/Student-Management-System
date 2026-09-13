import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TeacherForm from '../TeacherForm.jsx';
import LoadingSpinner from '../../components/LoadingSpinner.jsx';
import ErrorMessage from '../../components/ErrorMessage.jsx';
import { getTeacherById, updateTeacher } from '../../api/teacherApi.js';

export default function EditTeacher() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    getTeacherById(id)
      .then((data) =>
        setTeacher({
          ...data,
          departmentId: data.department?.id || '',
          courseIds: data.courses.map((c) => c.id)
        })
      )
      .catch(setLoadError)
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSubmit(payload) {
    setSubmitError(null);
    try {
      await updateTeacher(id, payload);
      navigate('/admin/teachers', { replace: true });
    } catch (err) {
      setSubmitError(err);
    }
  }

  if (loading) return <LoadingSpinner label="Loading teacher..." />;
  if (loadError) return <ErrorMessage error={loadError} />;

  return (
    <div>
      <h4 className="fw-bold mb-3">Edit Teacher</h4>
      <div className="sms-card p-4">
        <TeacherForm initialValues={teacher} onSubmit={handleSubmit} submitLabel="Save Changes" submitError={submitError} />
      </div>
    </div>
  );
}
