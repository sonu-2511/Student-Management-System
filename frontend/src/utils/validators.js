export function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value || '');
}

export function isValidPhone(value) {
  return /^[+]?[0-9]{7,15}$/.test(value || '');
}

export function isRequired(value) {
  return value !== null && value !== undefined && String(value).trim().length > 0;
}

/**
 * Validates a student form payload; returns an { field: message } map of errors.
 * Empty object means the form is valid.
 */
export function validateStudentForm(form) {
  const errors = {};
  if (!isRequired(form.rollNumber)) errors.rollNumber = 'Roll number is required';
  if (!isRequired(form.username) || form.username.length < 4) errors.username = 'Username must be at least 4 characters';
  if (!isRequired(form.password) || form.password.length < 8 || !/[A-Za-z]/.test(form.password) || !/\d/.test(form.password)) {
    errors.password = 'Password must be 8+ characters with a letter and a digit';
  }
  if (!isRequired(form.firstName)) errors.firstName = 'First name is required';
  if (!isRequired(form.lastName)) errors.lastName = 'Last name is required';
  if (!isValidEmail(form.email)) errors.email = 'Enter a valid email address';
  if (!isValidPhone(form.phone)) errors.phone = 'Enter a valid phone number (7-15 digits)';
  if (!isRequired(form.dateOfBirth)) errors.dateOfBirth = 'Date of birth is required';
  if (!isRequired(form.gender)) errors.gender = 'Gender is required';
  if (!isRequired(form.admissionDate)) errors.admissionDate = 'Admission date is required';
  if (!form.semester || form.semester < 1 || form.semester > 12) {
    errors.semester = 'Semester must be between 1 and 12';
  }
  if (!isRequired(form.status)) errors.status = 'Status is required';
  return errors;
}

export function validateTeacherForm(form) {
  const errors = {};
  if (!isRequired(form.employeeId)) errors.employeeId = 'Employee ID is required';
  if (isRequired(form.username) && form.username.length < 4) errors.username = 'Username must be at least 4 characters';
  if (isRequired(form.password) && (form.password.length < 8 || !/[A-Za-z]/.test(form.password) || !/\d/.test(form.password))) {
    errors.password = 'Password must be 8+ characters with a letter and a digit';
  }
  if (!isRequired(form.firstName)) errors.firstName = 'First name is required';
  if (!isRequired(form.lastName)) errors.lastName = 'Last name is required';
  if (!isValidEmail(form.email)) errors.email = 'Enter a valid email address';
  if (!isValidPhone(form.phone)) errors.phone = 'Enter a valid phone number (7-15 digits)';
  if (!isRequired(form.joiningDate)) errors.joiningDate = 'Joining date is required';
  if (!isRequired(form.status)) errors.status = 'Status is required';
  return errors;
}
