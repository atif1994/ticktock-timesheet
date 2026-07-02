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
    <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 mb-5">
      {/* Date Range button-styled inputs */}
      <div className="relative inline-flex items-center gap-0">
        <div className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-sm text-gray-600 hover:border-gray-300 transition">
          <svg className="h-4 w-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="hidden sm:inline text-gray-400">Date Range</span>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => onDateFromChange(e.target.value)}
            aria-label="Date from"
            className="absolute inset-0 w-full opacity-0 cursor-pointer"
            style={{ fontSize: '0' }}
          />
        </div>
      </div>

      {/* Date From / To visible inputs (shown when a date is set) */}
      {(dateFrom || dateTo) && (
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => onDateFromChange(e.target.value)}
            aria-label="Date from"
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
          <span className="text-gray-400 text-sm">—</span>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => onDateToChange(e.target.value)}
            aria-label="Date to"
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>
      )}

      {/* Status select */}
      <div className="relative flex items-center">
        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value as TimesheetStatus | 'all')}
          className="appearance-none rounded-lg border border-gray-200 bg-white pl-3.5 pr-8 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-200 cursor-pointer"
        >
          <option value="all">Status</option>
          <option value="COMPLETED">Completed</option>
          <option value="INCOMPLETE">Incomplete</option>
          <option value="MISSING">Missing</option>
        </select>
        <svg
          className="pointer-events-none absolute right-2.5 h-4 w-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {hasFilters && (
        <button
          onClick={() => {
            onStatusChange('all');
            onDateFromChange('');
            onDateToChange('');
          }}
          className="text-sm text-blue-600 hover:text-blue-800 hover:underline whitespace-nowrap transition"
        >
          Clear
        </button>
      )}
    </div>
  );
}
