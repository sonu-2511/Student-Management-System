import axiosClient from './axiosClient.js';

export async function getAnnouncements() {
  const response = await axiosClient.get('/announcements');
  return response.data;
}

export async function createAnnouncement(payload) {
  const response = await axiosClient.post('/announcements', payload);
  return response.data;
}