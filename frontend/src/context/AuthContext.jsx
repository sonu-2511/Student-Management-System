import React, { createContext, useCallback, useMemo, useState } from 'react';
import { loginRequest } from '../api/authApi.js';

export const AuthContext = createContext(null);

const STORAGE_KEY = 'sms_auth';

function loadStoredAuth() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(loadStoredAuth);

  const login = useCallback(async (username, password) => {
    const data = await loginRequest(username, password);
    const nextAuth = {
      token: data.token,
      username: data.username,
      role: data.role,
      studentId: data.studentId ?? null,
      teacherId: data.teacherId ?? null
    };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(nextAuth));
    setAuth(nextAuth);
    return nextAuth;
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY);
    setAuth(null);
  }, []);

  const value = useMemo(
    () => ({
      isAuthenticated: !!auth,
      token: auth?.token ?? null,
      username: auth?.username ?? null,
      role: auth?.role ?? null,
      studentId: auth?.studentId ?? null,
      teacherId: auth?.teacherId ?? null,
      login,
      logout
    }),
    [auth, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
