import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentForm from '../StudentForm.jsx';
import { createStudent } from '../../api/studentApi.js';

export default function AddStudent() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [credentials, setCredentials] = useState(null);

  async function handleSubmit(payload) {
    setError(null);
    try {
      const created = await createStudent(payload);
      setCredentials(created);
    } catch (err) {
      setError(err);
    }
  }

  return (
    <div>
      <h4 className="fw-bold mb-3">Add Student</h4>
      {credentials && (
        <div className="alert alert-success">
          <h6 className="alert-heading">Student created</h6>
          <p className="mb-2">The student account was created by the administrator.</p>
          <div><strong>Username:</strong> {credentials.username}</div>
          <div><strong>Password:</strong> Set by the administrator</div>
          <hr />
          <button
            type="button"
            className="btn btn-success btn-sm"
            onClick={() => navigate(`/admin/students/${credentials.student.id}`, { replace: true })}
          >
            Continue to student
          </button>
        </div>
      )}
      <div className="sms-card p-4">
        <StudentForm onSubmit={handleSubmit} submitLabel="Create Student" submitError={error} />
      </div>
    </div>
  );
}
