import React from 'react';

const GRADIENTS = {
  primary: 'linear-gradient(135deg, #2c5282 0%, #1e3a5f 100%)',
  success: 'linear-gradient(135deg, #38a169 0%, #2f855a 100%)',
  warning: 'linear-gradient(135deg, #dd6b20 0%, #c05621 100%)',
  info: 'linear-gradient(135deg, #3182ce 0%, #2b6cb0 100%)',
  danger: 'linear-gradient(135deg, #e53e3e 0%, #c53030 100%)',
  purple: 'linear-gradient(135deg, #805ad5 0%, #6b46c1 100%)'
};

export default function DashboardCard({ label, value, icon, variant = 'primary' }) {
  return (
    <div className="sms-stat-card" style={{ background: GRADIENTS[variant] || GRADIENTS.primary }}>
      <div className="d-flex justify-content-between align-items-start">
        <span className="sms-stat-label">{label}</span>
        {icon && <i className={`bi ${icon} sms-stat-icon`} />}
      </div>
      <div className="sms-stat-value">{value}</div>
    </div>
  );
}
