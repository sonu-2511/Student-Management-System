export function formatDate(dateStr) {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
}

export function formatDateTime(dateStr) {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
}

export function initials(firstName, lastName) {
  const a = firstName ? firstName[0] : '';
  const b = lastName ? lastName[0] : '';
  return (a + b).toUpperCase() || '?';
}

export function fullName(firstName, lastName) {
  return [firstName, lastName].filter(Boolean).join(' ');
}

export function statusBadgeClass(status) {
  switch (status) {
    case 'ACTIVE':
    case 'PRESENT':
      return 'text-bg-success';
    case 'INACTIVE':
    case 'ABSENT':
      return 'text-bg-secondary';
    case 'GRADUATED':
      return 'text-bg-primary';
    case 'SUSPENDED':
      return 'text-bg-danger';
    case 'LEAVE':
      return 'text-bg-warning';
    default:
      return 'text-bg-secondary';
  }
}

export function gradeBadgeClass(grade) {
  switch (grade) {
    case 'O':
    case 'A+':
      return 'text-bg-success';
    case 'A':
    case 'B+':
      return 'text-bg-primary';
    case 'B':
    case 'C':
      return 'text-bg-warning';
    case 'F':
      return 'text-bg-danger';
    default:
      return 'text-bg-secondary';
  }
}
