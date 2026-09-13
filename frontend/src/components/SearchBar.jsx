import React, { useState } from 'react';

export default function SearchBar({ placeholder = 'Search...', onSearch, initialValue = '' }) {
  const [value, setValue] = useState(initialValue);

  function handleSubmit(e) {
    e.preventDefault();
    onSearch(value.trim());
  }

  function handleClear() {
    setValue('');
    onSearch('');
  }

  return (
    <form className="d-flex" onSubmit={handleSubmit}>
      <div className="input-group">
        <span className="input-group-text bg-white">
          <i className="bi bi-search" />
        </span>
        <input
          type="text"
          className="form-control"
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        {value && (
          <button type="button" className="btn btn-outline-secondary" onClick={handleClear}>
            <i className="bi bi-x-lg" />
          </button>
        )}
        <button type="submit" className="btn btn-primary">
          Search
        </button>
      </div>
    </form>
  );
}
