import axiosClient from './axiosClient.js';

export async function getSetupStatus() {
  const response = await axiosClient.get('/auth/setup-status');
  return response.data;
}

export async function bootstrapAdmin(payload) {
  const response = await axiosClient.post('/auth/bootstrap-admin', payload);
  return response.data;
}
