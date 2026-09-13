import React from 'react';
import { Outlet } from 'react-router-dom';
import DashboardShell from './DashboardShell.jsx';

export default function TeacherLayout() {
  return (
    <DashboardShell role="TEACHER" title="Teacher Portal">
      <Outlet />
    </DashboardShell>
  );
}
