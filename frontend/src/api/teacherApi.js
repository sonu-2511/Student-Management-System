import axiosClient from './axiosClient.js';

export async function getTeachers(params) {
  const response = await axiosClient.get('/teachers', { params });
  return response.data;
}

export async function getTeachersByDepartment(departmentId, params) {
  const response = await axiosClient.get(`/teachers/department/${departmentId}`, { params });
  return response.data;
}

export async function getTeacherById(id) {
  const response = await axiosClient.get(`/teachers/${id}`);
  return response.data;
}

export async function getMyTeacherProfile() {
  const response = await axiosClient.get('/teachers/me');
  return response.data;
}

export async function updateMyTeacherProfile(payload) {
  const response = await axiosClient.patch('/teachers/me', payload);
  return response.data;
}

export async function createTeacher(payload) {
  const response = await axiosClient.post('/teachers', payload);
  return response.data;
}

export async function updateTeacher(id, payload) {
  const response = await axiosClient.put(`/teachers/${id}`, payload);
  return response.data;
}

export async function deleteTeacher(id) {
  await axiosClient.delete(`/teachers/${id}`);
}
