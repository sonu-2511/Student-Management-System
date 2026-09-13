import React from 'react';

export default function FormInput({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  required = false,
  as = 'input',
  options = [],
  placeholder = '',
  disabled = false,
  colClass = 'col-12'
}) {
  const controlId = `field-${name}`;

  return (
    <div className={colClass}>
      <label htmlFor={controlId} className="form-label">
        {label} {required && <span className="text-danger">*</span>}
      </label>

      {as === 'select' ? (
        <select
          id={controlId}
          name={name}
          className={`form-select ${error ? 'is-invalid' : ''}`}
          value={value ?? ''}
          onChange={onChange}
          disabled={disabled}
        >
          <option value="">Select {label.toLowerCase()}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : as === 'textarea' ? (
        <textarea
          id={controlId}
          name={name}
          className={`form-control ${error ? 'is-invalid' : ''}`}
          value={value ?? ''}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          rows={3}
        />
      ) : (
        <input
          id={controlId}
          name={name}
          type={type}
          className={`form-control ${error ? 'is-invalid' : ''}`}
          value={value ?? ''}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
        />
      )}

      {error && <div className="invalid-feedback d-block">{error}</div>}
    </div>
  );
}
