import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth.js';
import DataTable from '../../components/DataTable.jsx';
import ErrorMessage from '../../components/ErrorMessage.jsx';
import { getMarksByStudent } from '../../api/marksApi.js';

export default function MyCourses() {
  const { studentId } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!studentId) { setLoading(false); return; }
    getMarksByStudent(studentId, { size: 100 })
      .then((res) => setCourses(res.content))
      .catch(setError)
      .finally(() => setLoading(false));
  }, [studentId]);

  if (!studentId) return <div className="alert alert-warning">Your login isn't linked to a student profile yet.</div>;

  const columns = [
    { key: 'code', label: 'Code', render: (r) => r.course.courseCode },
    { key: 'name', label: 'Course Name', render: (r) => r.course.courseName }
  ];

  return (
    <div>
      <h4 className="fw-bold mb-3">My Courses</h4>
      {error && <ErrorMessage error={error} />}
      <div className="sms-card p-3">
        <DataTable columns={columns} rows={courses} loading={loading} emptyMessage="No courses on record yet." />
      </div>
    </div>
  );
}
