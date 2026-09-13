import React from 'react';
import { Outlet } from 'react-router-dom';
import DashboardShell from './DashboardShell.jsx';

export default function StudentLayout() {
  return (
    <DashboardShell role="STUDENT" title="Student Portal">
      <Outlet />
    </DashboardShell>
  );
}
