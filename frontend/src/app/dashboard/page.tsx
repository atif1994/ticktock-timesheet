'use client';

import { useState } from 'react';
import Header from '@/components/dashboard/Header';
import Filters from '@/components/dashboard/Filters';
import TimesheetTable from '@/components/dashboard/TimesheetTable';
import Pagination from '@/components/dashboard/Pagination';
import EntryModal from '@/components/dashboard/EntryModal';
import { useTimesheets } from '@/hooks/useTimesheets';
import { TimesheetStatus } from '@/types';

export default function DashboardPage() {
  // Filter / pagination state
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const [statusFilter, setStatusFilter] = useState<TimesheetStatus | 'all'>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Modal state
  const [modalTimesheetId, setModalTimesheetId] = useState<string | null>(null);

  const { data, isLoading, mutate } = useTimesheets({
    page,
    perPage,
    status: statusFilter,
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
  });

  function handleStatusChange(value: TimesheetStatus | 'all') {
    setStatusFilter(value);
    setPage(1);
  }

  function handleDateFromChange(value: string) {
    setDateFrom(value);
    setPage(1);
  }

  function handleDateToChange(value: string) {
    setDateTo(value);
    setPage(1);
  }

  function handlePerPageChange(value: number) {
    setPerPage(value);
    setPage(1);
  }

  return (
    <>
      <Header breadcrumb="Timesheets" />

      <main className="flex-1 px-3 py-4 sm:px-6 sm:py-8">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-xl bg-white shadow-sm border border-gray-100 px-4 py-5 sm:px-6 sm:py-6">
            <h1 className="text-lg font-semibold text-gray-900 mb-5">
              Your Timesheets
            </h1>

            <Filters
              statusFilter={statusFilter}
              dateFrom={dateFrom}
              dateTo={dateTo}
              onStatusChange={handleStatusChange}
              onDateFromChange={handleDateFromChange}
              onDateToChange={handleDateToChange}
            />

            {isLoading ? (
              <div className="py-16 text-center text-gray-400 text-sm">
                Loading…
              </div>
            ) : (
              <>
                <TimesheetTable
                  timesheets={data?.data ?? []}
                  onOpenModal={setModalTimesheetId}
                />

                {data && data.totalPages > 1 && (
                  <Pagination
                    page={page}
                    totalPages={data.totalPages}
                    perPage={perPage}
                    onPageChange={setPage}
                    onPerPageChange={handlePerPageChange}
                  />
                )}
              </>
            )}
          </div>

          {/* Legend */}
          <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-500 px-1">
            <span>
              <strong className="text-green-600">Completed</strong> = 40 hours logged
            </span>
            <span>
              <strong className="text-orange-500">Incomplete</strong> = less than 40 hours
            </span>
            <span>
              <strong className="text-red-400">Missing</strong> = no hours added
            </span>
          </div>
        </div>
      </main>

      {/* Add Entry Modal */}
      {modalTimesheetId && (
        <EntryModal
          timesheetId={modalTimesheetId}
          onClose={() => setModalTimesheetId(null)}
          onSuccess={() => mutate()}
        />
      )}
    </>
  );
}
