import axiosClient from './axiosClient.js';

export async function getDepartments() {
  const response = await axiosClient.get('/departments');
  return response.data;
}

export async function getDepartmentById(id) {
  const response = await axiosClient.get(`/departments/${id}`);
  return response.data;
}

export async function createDepartment(payload) {
  const response = await axiosClient.post('/departments', payload);
  return response.data;
}

export async function updateDepartment(id, payload) {
  const response = await axiosClient.put(`/departments/${id}`, payload);
  return response.data;
}

export async function deleteDepartment(id) {
  await axiosClient.delete(`/departments/${id}`);
}
