'use client';

import Link from 'next/link';
import { Timesheet } from '@/types';
import StatusBadge from './StatusBadge';

function formatDateRange(startDate: string, endDate: string): string {
  const fmt = (d: string) => {
    const date = new Date(d + 'T00:00:00');
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const start = new Date(startDate + 'T00:00:00');
  const end = new Date(endDate + 'T00:00:00');

  if (start.getMonth() === end.getMonth()) {
    return `${start.getDate()} – ${end.getDate()} ${start.toLocaleString('en-GB', { month: 'long' })}, ${start.getFullYear()}`;
  }

  return `${fmt(startDate)} – ${fmt(endDate)}`;
}

function SortArrow() {
  return (
    <svg className="inline-block ml-1 h-3 w-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
}

interface ActionProps {
  timesheet: Timesheet;
  onOpenModal: (id: string) => void;
}

function RowAction({ timesheet, onOpenModal }: ActionProps) {
  if (timesheet.status === 'COMPLETED') {
    return (
      <Link
        href={`/dashboard/${timesheet.id}`}
        className="text-blue-600 hover:text-blue-800 font-medium text-sm transition"
      >
        View
      </Link>
    );
  }
  if (timesheet.status === 'INCOMPLETE') {
    return (
      <button
        onClick={() => onOpenModal(timesheet.id)}
        className="text-blue-600 hover:text-blue-800 font-medium text-sm transition"
      >
        Update
      </button>
    );
  }
  return (
    <button
      onClick={() => onOpenModal(timesheet.id)}
      className="text-blue-600 hover:text-blue-800 font-medium text-sm transition"
    >
      Create
    </button>
  );
}

interface Props {
  timesheets: Timesheet[];
  onOpenModal: (id: string) => void;
}

export default function TimesheetTable({ timesheets, onOpenModal }: Props) {
  if (timesheets.length === 0) {
    return (
      <div className="py-16 text-center text-gray-400 text-sm">
        No timesheets found for the selected filters.
      </div>
    );
  }

  return (
    <>
      {/* Mobile card view (< sm) */}
      <div className="sm:hidden space-y-3">
        {timesheets.map((ts) => (
          <div
            key={ts.id}
            className="rounded-lg border border-gray-100 bg-gray-50 px-4 py-4 flex flex-col gap-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                Week {ts.weekNumber}
              </span>
              <StatusBadge status={ts.status} />
            </div>
            <p className="text-sm text-gray-700 font-medium">
              {formatDateRange(ts.startDate, ts.endDate)}
            </p>
            <div className="flex justify-end">
              <RowAction timesheet={ts} onOpenModal={onOpenModal} />
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table view (sm+) */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left">
              <th className="pb-3 pr-4 font-semibold text-gray-500 uppercase text-xs tracking-wider w-20 select-none">
                Week # <SortArrow />
              </th>
              <th className="pb-3 pr-4 font-semibold text-gray-500 uppercase text-xs tracking-wider select-none">
                Date <SortArrow />
              </th>
              <th className="pb-3 pr-4 font-semibold text-gray-500 uppercase text-xs tracking-wider w-36 select-none">
                Status <SortArrow />
              </th>
              <th className="pb-3 font-semibold text-gray-500 uppercase text-xs tracking-wider text-right w-28">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {timesheets.map((ts) => (
              <tr key={ts.id} className="hover:bg-gray-50 transition">
                <td className="py-4 pr-4 font-medium text-gray-800">{ts.weekNumber}</td>
                <td className="py-4 pr-4 text-gray-600">{formatDateRange(ts.startDate, ts.endDate)}</td>
                <td className="py-4 pr-4">
                  <StatusBadge status={ts.status} />
                </td>
                <td className="py-4 text-right">
                  <RowAction timesheet={ts} onOpenModal={onOpenModal} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
