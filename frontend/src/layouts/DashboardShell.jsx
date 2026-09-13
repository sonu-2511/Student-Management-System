import React, { useState } from 'react';
import Sidebar from '../components/Sidebar.jsx';
import Navbar from '../components/Navbar.jsx';

export default function DashboardShell({ role, title, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div
      className="sms-shell"
      style={{ '--sms-sidebar-width': sidebarOpen ? '270px' : '88px' }}
    >
      <Sidebar role={role} open={sidebarOpen} onToggleSidebar={() => setSidebarOpen((v) => !v)} />
      <div className="sms-main">
        <Navbar title={title} onToggleSidebar={() => setSidebarOpen((v) => !v)} />
        <main className="sms-content">{children}</main>
      </div>
    </div>
  );
}
