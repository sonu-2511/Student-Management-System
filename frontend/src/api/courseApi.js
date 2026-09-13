import axiosClient from './axiosClient.js';

export async function getCourses(params) {
  const response = await axiosClient.get('/courses', { params });
  return response.data;
}

export async function getCourseById(id) {
  const response = await axiosClient.get(`/courses/${id}`);
  return response.data;
}

export async function createCourse(payload) {
  const response = await axiosClient.post('/courses', payload);
  return response.data;
}

export async function updateCourse(id, payload) {
  const response = await axiosClient.put(`/courses/${id}`, payload);
  return response.data;
}

export async function deleteCourse(id) {
  await axiosClient.delete(`/courses/${id}`);
}
