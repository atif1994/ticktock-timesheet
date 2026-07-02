'use client';

import { TimesheetStatus } from '@/types';

interface Props {
  statusFilter: TimesheetStatus | 'all';
  dateFrom: string;
  dateTo: string;
  onStatusChange: (value: TimesheetStatus | 'all') => void;
  onDateFromChange: (value: string) => void;
  onDateToChange: (value: string) => void;
}

export default function Filters({
  statusFilter,
  dateFrom,
  dateTo,
  onStatusChange,
  onDateFromChange,
  onDateToChange,
}: Props) {
  const hasFilters = statusFilter !== 'all' || dateFrom || dateTo;

  return (
    <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 mb-5">
      {/* Date range */}
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <input
          id="dateFrom"
          type="date"
          value={dateFrom}
          onChange={(e) => onDateFromChange(e.target.value)}
          aria-label="Date from"
          className="flex-1 sm:flex-none min-w-0 rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
        <span className="text-gray-400 text-sm shrink-0">—</span>
        <input
          id="dateTo"
          type="date"
          value={dateTo}
          onChange={(e) => onDateToChange(e.target.value)}
          aria-label="Date to"
          className="flex-1 sm:flex-none min-w-0 rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
      </div>

      {/* Status + clear row */}
      <div className="flex items-center gap-3">
        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value as TimesheetStatus | 'all')}
          className="rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
        >
          <option value="all">All Statuses</option>
          <option value="COMPLETED">Completed</option>
          <option value="INCOMPLETE">Incomplete</option>
          <option value="MISSING">Missing</option>
        </select>

        {hasFilters && (
          <button
            onClick={() => {
              onStatusChange('all');
              onDateFromChange('');
              onDateToChange('');
            }}
            className="text-sm text-blue-600 hover:underline whitespace-nowrap"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
