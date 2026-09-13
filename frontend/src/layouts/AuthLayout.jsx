import React from 'react';
import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="sms-auth-shell">
      <Outlet />
    </div>
  );
}
