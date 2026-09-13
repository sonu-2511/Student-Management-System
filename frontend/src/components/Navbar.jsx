import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';

export default function Navbar({ onToggleSidebar, title }) {
  const { username, role, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <header className="sms-topbar">
      <div className="d-flex align-items-center gap-3">
        <button
          className="btn btn-light d-lg-none"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation"
        >
          <i className="bi bi-list" />
        </button>
        <div>
          <div className="sms-page-kicker">Operations</div>
          <h5 className="mb-0 fw-semibold">{title}</h5>
        </div>
      </div>

      <div className="d-flex align-items-center gap-3">
        <div className="sms-status-chip">
          <span className="sms-status-dot" />
          System online
        </div>

        <div className="dropdown">
          <button
            className="btn btn-light d-flex align-items-center gap-2 sms-user-menu"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <span className="sms-avatar-sm" style={{ width: 32, height: 32, fontSize: '0.75rem' }}>
              {username ? username.slice(0, 2).toUpperCase() : '?'}
            </span>
            <span className="d-none d-sm-inline">{username}</span>
            <span className="badge text-bg-light border">{role}</span>
          </button>
          <ul className="dropdown-menu dropdown-menu-end">
            <li>
              <button className="dropdown-item" onClick={handleLogout}>
                <i className="bi bi-box-arrow-right me-2" />
                Log out
              </button>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
