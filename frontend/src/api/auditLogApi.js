import axiosClient from './axiosClient.js';

export async function getAuditLogs(params) {
  const response = await axiosClient.get('/audit-logs', { params });
  return response.data;
}