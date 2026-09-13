import axiosClient from './axiosClient.js';

export async function recordMarks(payload) {
  const response = await axiosClient.post('/marks', payload);
  return response.data;
}

export async function updateMarks(id, payload) {
  const response = await axiosClient.put(`/marks/${id}`, payload);
  return response.data;
}

export async function getMarksByStudent(studentId, params) {
  const response = await axiosClient.get(`/marks/student/${studentId}`, { params });
  return response.data;
}

export async function getMarksByCourse(courseId, params) {
  const response = await axiosClient.get(`/marks/course/${courseId}`, { params });
  return response.data;
}
