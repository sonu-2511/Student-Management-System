import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TeacherForm from '../TeacherForm.jsx';
import { createTeacher } from '../../api/teacherApi.js';

export default function AddTeacher() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  async function handleSubmit(payload) {
    setError(null);
    try {
      await createTeacher(payload);
      navigate('/admin/teachers', { replace: true });
    } catch (err) {
      setError(err);
    }
  }

  return (
    <div>
      <h4 className="fw-bold mb-3">Add Teacher</h4>
      <div className="sms-card p-4">
        <TeacherForm onSubmit={handleSubmit} submitLabel="Create Teacher" submitError={error} />
      </div>
    </div>
  );
}
