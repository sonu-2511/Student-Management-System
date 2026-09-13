import axiosClient from './axiosClient.js';

export async function getStudents(params) {
  const response = await axiosClient.get('/students', { params });
  return response.data;
}

export async function searchStudents(keyword, params) {
  const response = await axiosClient.get('/students/search', { params: { keyword, ...params } });
  return response.data;
}

export async function getStudentsByDepartment(departmentId, params) {
  const response = await axiosClient.get(`/students/department/${departmentId}`, { params });
  return response.data;
}

export async function getStudentById(id) {
  const response = await axiosClient.get(`/students/${id}`);
  return response.data;
}

export async function getMyStudentProfile() {
  const response = await axiosClient.get('/students/me');
  return response.data;
}

export async function updateMyStudentProfile(payload) {
  const response = await axiosClient.patch('/students/me', payload);
  return response.data;
}

export async function createStudent(payload) {
  const response = await axiosClient.post('/students', payload);
  return response.data;
}

export async function updateStudent(id, payload) {
  const response = await axiosClient.put(`/students/${id}`, payload);
  return response.data;
}

export async function deleteStudent(id) {
  await axiosClient.delete(`/students/${id}`);
}
