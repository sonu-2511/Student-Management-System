import React from 'react';
import LoadingSpinner from './LoadingSpinner.jsx';

/**
 * @param columns [{ key, label, render?: (row) => node, className? }]
 * @param rows array of data objects
 * @param keyField field name to use as the React key (default 'id')
 * @param onRowClick optional (row) => void, makes rows clickable
 * @param loading boolean
 * @param emptyMessage string shown when rows is empty
 */
export default function DataTable({
  columns,
  rows,
  keyField = 'id',
  onRowClick,
  loading = false,
  emptyMessage = 'No records found.'
}) {
  if (loading) {
    return <LoadingSpinner label="Loading records..." />;
  }

  if (!rows || rows.length === 0) {
    return (
      <div className="sms-empty-state">
        <i className="bi bi-inbox display-6 d-block mb-2" />
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="table sms-table align-middle">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} className={col.className}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row[keyField]}
              className={onRowClick ? 'sms-clickable-row' : ''}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
            >
              {columns.map((col) => (
                <td key={col.key} className={col.className}>
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
