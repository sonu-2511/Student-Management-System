import React from 'react';
import { Outlet } from 'react-router-dom';
import DashboardShell from './DashboardShell.jsx';

export default function AdminLayout() {
  return (
    <DashboardShell role="ADMIN" title="Admin Portal">
      <Outlet />
    </DashboardShell>
  );
}
