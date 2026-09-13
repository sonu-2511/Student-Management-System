import axiosClient from './axiosClient.js';

export async function markAttendance(payload) {
  const response = await axiosClient.post('/attendance', payload);
  return response.data;
}

export async function updateAttendance(id, payload) {
  const response = await axiosClient.put(`/attendance/${id}`, payload);
  return response.data;
}

export async function getAttendanceByStudent(studentId, params) {
  const response = await axiosClient.get(`/attendance/student/${studentId}`, { params });
  return response.data;
}

export async function getAttendanceSummary(studentId) {
  const response = await axiosClient.get(`/attendance/student/${studentId}/summary`);
  return response.data;
}

export async function getAttendanceByCourse(courseId, params) {
  const response = await axiosClient.get(`/attendance/course/${courseId}`, { params });
  return response.data;
}
