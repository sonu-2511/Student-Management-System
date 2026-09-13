import axiosClient from './axiosClient.js';

export async function getDashboardSummary() {
  const response = await axiosClient.get('/dashboard/summary');
  return response.data;
}

export async function getStudentsByDepartmentReport() {
  const response = await axiosClient.get('/reports/students-by-department');
  return response.data;
}

export async function getStudentsBySemesterReport() {
  const response = await axiosClient.get('/reports/students-by-semester');
  return response.data;
}

export async function getAttendanceReport(params) {
  const response = await axiosClient.get('/reports/attendance', { params });
  return response.data;
}

export async function getGradeDistributionReport(params) {
  const response = await axiosClient.get('/reports/grade-distribution', { params });
  return response.data;
}

export async function getAtRiskStudents() {
  const response = await axiosClient.get('/dashboard/at-risk-students');
  return response.data;
}
