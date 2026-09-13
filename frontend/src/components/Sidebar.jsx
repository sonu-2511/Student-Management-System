import React from 'react';
import { NavLink } from 'react-router-dom';

const NAV_BY_ROLE = {
  ADMIN: [
    { section: 'Overview', links: [{ to: '/admin/dashboard', label: 'Dashboard', icon: 'bi-speedometer2' }] },
    {
      section: 'Academics',
      links: [
        { to: '/admin/students', label: 'Students', icon: 'bi-people' },
        { to: '/admin/teachers', label: 'Teachers', icon: 'bi-person-workspace' },
        { to: '/admin/departments', label: 'Departments', icon: 'bi-diagram-3' },
        { to: '/admin/courses', label: 'Courses', icon: 'bi-journal-bookmark' }
      ]
    },
    {
      section: 'Records',
      links: [
        { to: '/admin/attendance', label: 'Attendance', icon: 'bi-calendar-check' },
        { to: '/admin/marks', label: 'Marks', icon: 'bi-clipboard-data' },
        { to: '/admin/reports', label: 'Reports', icon: 'bi-graph-up' }
      ]
    },
    { section: 'Administration', links: [
      { to: '/admin/users', label: 'User Management', icon: 'bi-shield-lock' },
      { to: '/admin/audit-logs', label: 'Audit Logs', icon: 'bi-clock-history' },
      { to: '/admin/announcements', label: 'Announcements', icon: 'bi-megaphone' }
    ] }
  ],
  TEACHER: [
    { section: 'Overview', links: [
      { to: '/teacher/dashboard', label: 'Dashboard', icon: 'bi-speedometer2' },
      { to: '/teacher/profile', label: 'My Profile', icon: 'bi-person-circle' }
    ] },
    {
      section: 'Teaching',
      links: [
        { to: '/teacher/students', label: 'My Students', icon: 'bi-people' },
        { to: '/teacher/courses', label: 'Courses', icon: 'bi-journal-bookmark' },
        { to: '/teacher/attendance', label: 'Attendance', icon: 'bi-calendar-check' },
        { to: '/teacher/marks', label: 'Marks', icon: 'bi-clipboard-data' }
      ]
    }
  ],
  STUDENT: [
    { section: 'Overview', links: [{ to: '/student/dashboard', label: 'Dashboard', icon: 'bi-speedometer2' }] },
    {
      section: 'My Academics',
      links: [
        { to: '/student/profile', label: 'My Profile', icon: 'bi-person-circle' },
        { to: '/student/courses', label: 'My Courses', icon: 'bi-journal-bookmark' },
        { to: '/student/attendance', label: 'My Attendance', icon: 'bi-calendar-check' },
        { to: '/student/marks', label: 'My Marks', icon: 'bi-clipboard-data' },
        { to: '/student/grades', label: 'My Grades', icon: 'bi-award' }
      ]
    }
  ]
};

export default function Sidebar({ role, open, onToggleSidebar }) {
  const sections = NAV_BY_ROLE[role] || [];

  function handleLinkClick() {
    if (window.innerWidth < 992) {
      onToggleSidebar(false);
    }
  }

  return (
    <aside className={`sms-sidebar ${open ? 'open' : 'collapsed'}`}>
      <div className="sms-sidebar-brand">
        <div className="sms-brand-pill">
          <i className="bi bi-building-check" />
        </div>
        {open && (
          <div className="sms-brand-text">
            <div className="sms-brand-name">NorthStar</div>
            <small className="sms-brand-subtitle">Campus OS</small>
          </div>
        )}
        <button
          type="button"
          className="btn btn-link sms-sidebar-toggle"
          onClick={() => onToggleSidebar()}
          aria-label={open ? 'Close sidebar' : 'Open sidebar'}
          title={open ? 'Close sidebar' : 'Open sidebar'}
        >
          <i className={`bi ${open ? 'bi-chevron-left' : 'bi-chevron-right'}`} />
        </button>
      </div>
      {sections.map((section) => (
        <div key={section.section}>
          {open && <div className="sms-nav-section">{section.section}</div>}
          {section.links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={handleLinkClick}
              className={({ isActive }) => `sms-nav-link ${isActive ? 'active' : ''}`}
              title={link.label}
            >
              <i className={`bi ${link.icon}`} />
              {open && <span>{link.label}</span>}
            </NavLink>
          ))}
        </div>
      ))}
    </aside>
  );
}
