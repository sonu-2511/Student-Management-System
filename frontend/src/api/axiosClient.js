import axios from 'axios';

const STORAGE_KEY = 'sms_auth';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' }
});

// Attach the JWT to every outgoing request, read fresh each time so a
// login/logout in another tab/component is always reflected immediately.
axiosClient.interceptors.request.use((config) => {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    const auth = raw ? JSON.parse(raw) : null;
    if (auth?.token) {
      config.headers.Authorization = `Bearer ${auth.token}`;
    }
  } catch {
    // ignore malformed storage
  }
  return config;
});

// On 401 (expired/invalid token), clear the session and send the user back to login.
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      sessionStorage.removeItem(STORAGE_KEY);
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
