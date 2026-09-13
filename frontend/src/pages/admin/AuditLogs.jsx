import React, { useEffect, useState } from 'react';
import DataTable from '../../components/DataTable.jsx';
import ErrorMessage from '../../components/ErrorMessage.jsx';
import Pagination from '../../components/Pagination.jsx';
import { getAuditLogs } from '../../api/auditLogApi.js';
import { formatDateTime } from '../../utils/formatters.js';

export default function AuditLogs() {
  const [logs, setLogs] = useState({ content: [], page: 0, totalPages: 0, totalElements: 0 });
  const [page, setPage] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    getAuditLogs({ page, size: 30, sort: 'createdAt,desc' }).then(setLogs).catch(setError);
  }, [page]);

  return (
    <div>
      <h4 className="fw-bold mb-3">Audit Logs</h4>
      {error && <ErrorMessage error={error} />}
      <div className="sms-card p-3">
        <DataTable
          rows={logs.content}
          loading={!logs.content}
          emptyMessage="No audit events recorded yet."
          columns={[
            { key: 'createdAt', label: 'Time', render: (log) => formatDateTime(log.createdAt) },
            { key: 'username', label: 'User' },
            { key: 'action', label: 'Action' },
            { key: 'resource', label: 'Resource' },
            { key: 'resourceId', label: 'ID' },
            { key: 'details', label: 'Details' }
          ]}
        />
        <Pagination page={logs.page} totalPages={logs.totalPages} totalElements={logs.totalElements} onPageChange={setPage} />
      </div>
    </div>
  );
}