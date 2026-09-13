import React, { useEffect, useState } from 'react';
import DataTable from '../../components/DataTable.jsx';
import Pagination from '../../components/Pagination.jsx';
import ErrorMessage from '../../components/ErrorMessage.jsx';
import { getCourses } from '../../api/courseApi.js';

export default function TeacherCourses() {
  const [courses, setCourses] = useState({ content: [], page: 0, totalPages: 0, totalElements: 0 });
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    getCourses({ page, size: 10 })
      .then(setCourses)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [page]);

  const columns = [
    { key: 'courseCode', label: 'Code' },
    { key: 'courseName', label: 'Name' },
    { key: 'credits', label: 'Credits' },
    { key: 'semester', label: 'Semester' },
    { key: 'department', label: 'Department', render: (row) => row.department.departmentName }
  ];

  return (
    <div>
      <h4 className="fw-bold mb-3">Courses</h4>
      {error && <ErrorMessage error={error} />}
      <div className="sms-card p-3">
        <DataTable columns={columns} rows={courses.content} loading={loading} emptyMessage="No courses found." />
        <Pagination page={courses.page} totalPages={courses.totalPages} totalElements={courses.totalElements} onPageChange={setPage} />
      </div>
    </div>
  );
}
