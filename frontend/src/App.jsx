import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './hooks/useAuth.js';
import { homeForRole } from './routes/ProtectedRoute.jsx';
import ProtectedRoute from './routes/ProtectedRoute.jsx';

import AuthLayout from './layouts/AuthLayout.jsx';
import AdminLayout from './layouts/AdminLayout.jsx';
import TeacherLayout from './layouts/TeacherLayout.jsx';
import StudentLayout from './layouts/StudentLayout.jsx';

import Login from './pages/public/Login.jsx';
import Setup from './pages/public/Setup.jsx';
import ForgotPassword from './pages/public/ForgotPassword.jsx';
import NotFound from './pages/public/NotFound.jsx';

import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import StudentList from './pages/admin/StudentList.jsx';
import AddStudent from './pages/admin/AddStudent.jsx';
import EditStudent from './pages/admin/EditStudent.jsx';
import StudentDetails from './pages/admin/StudentDetails.jsx';
import TeacherList from './pages/admin/TeacherList.jsx';
import AddTeacher from './pages/admin/AddTeacher.jsx';
import EditTeacher from './pages/admin/EditTeacher.jsx';
import DepartmentList from './pages/admin/DepartmentList.jsx';
import CourseList from './pages/admin/CourseList.jsx';
import AdminAttendance from './pages/admin/Attendance.jsx';
import AdminMarks from './pages/admin/Marks.jsx';
import Reports from './pages/admin/Reports.jsx';
import UserManagement from './pages/admin/UserManagement.jsx';
import AdminAnnouncements from './pages/admin/Announcements.jsx';
import AuditLogs from './pages/admin/AuditLogs.jsx';

import TeacherDashboard from './pages/teacher/TeacherDashboard.jsx';
import MyStudents from './pages/teacher/MyStudents.jsx';
import TeacherAttendance from './pages/teacher/Attendance.jsx';
import TeacherMarks from './pages/teacher/Marks.jsx';
import TeacherCourses from './pages/teacher/Courses.jsx';
import TeacherProfile from './pages/teacher/MyProfile.jsx';

import StudentDashboard from './pages/student/StudentDashboard.jsx';
import MyProfile from './pages/student/MyProfile.jsx';
import MyCourses from './pages/student/MyCourses.jsx';
import MyAttendance from './pages/student/MyAttendance.jsx';
import MyMarks from './pages/student/MyMarks.jsx';
import MyGrades from './pages/student/MyGrades.jsx';

export default function App() {
  const { isAuthenticated, role } = useAuth();

  return (
    <Routes>
      {/* Root redirect */}
      <Route
        path="/"
        element={<Navigate to={isAuthenticated ? homeForRole(role) : '/login'} replace />}
      />

      {/* Public routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/setup" element={<Setup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Route>

      {/* Admin routes */}
      <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/students" element={<StudentList />} />
          <Route path="/admin/students/add" element={<AddStudent />} />
          <Route path="/admin/students/:id" element={<StudentDetails />} />
          <Route path="/admin/students/:id/edit" element={<EditStudent />} />
          <Route path="/admin/teachers" element={<TeacherList />} />
          <Route path="/admin/teachers/add" element={<AddTeacher />} />
          <Route path="/admin/teachers/:id/edit" element={<EditTeacher />} />
          <Route path="/admin/departments" element={<DepartmentList />} />
          <Route path="/admin/courses" element={<CourseList />} />
          <Route path="/admin/attendance" element={<AdminAttendance />} />
          <Route path="/admin/marks" element={<AdminMarks />} />
          <Route path="/admin/reports" element={<Reports />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/announcements" element={<AdminAnnouncements />} />
          <Route path="/admin/audit-logs" element={<AuditLogs />} />
        </Route>
      </Route>

      {/* Teacher routes */}
      <Route element={<ProtectedRoute allowedRoles={['TEACHER']} />}>
        <Route element={<TeacherLayout />}>
          <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
          <Route path="/teacher/profile" element={<TeacherProfile />} />
          <Route path="/teacher/students" element={<MyStudents />} />
          <Route path="/teacher/attendance" element={<TeacherAttendance />} />
          <Route path="/teacher/marks" element={<TeacherMarks />} />
          <Route path="/teacher/courses" element={<TeacherCourses />} />
        </Route>
      </Route>

      {/* Student routes */}
      <Route element={<ProtectedRoute allowedRoles={['STUDENT']} />}>
        <Route element={<StudentLayout />}>
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/profile" element={<MyProfile />} />
          <Route path="/student/courses" element={<MyCourses />} />
          <Route path="/student/attendance" element={<MyAttendance />} />
          <Route path="/student/marks" element={<MyMarks />} />
          <Route path="/student/grades" element={<MyGrades />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
