import axiosClient from './axiosClient.js';

export async function loginRequest(username, password) {
  const response = await axiosClient.post('/auth/login', { username, password });
  return response.data;
}

export async function registerRequest(payload) {
  const response = await axiosClient.post('/auth/register', payload);
  return response.data;
}

export async function changePassword(payload) {
  await axiosClient.put('/auth/password', payload);
}

export async function getUsers(params) {
  const response = await axiosClient.get('/users', { params });
  return response.data;
}

export async function updateUserStatus(id, enabled) {
  const response = await axiosClient.patch(`/users/${id}/status`, { enabled });
  return response.data;
}

export async function resetUserPassword(id, newPassword) {
  await axiosClient.put(`/users/${id}/password`, { newPassword });
}
