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
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const [statusFilter, setStatusFilter] = useState<TimesheetStatus | 'all'>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [modalTimesheetId, setModalTimesheetId] = useState<string | null>(null);

  const { data, isLoading, error, mutate } = useTimesheets({
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
              <div className="py-16 text-center">
                <div className="inline-block h-7 w-7 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
                <p className="mt-2 text-sm text-gray-400">Loading timesheets…</p>
              </div>
            ) : error ? (
              <div className="py-12 text-center">
                <p className="text-sm text-red-500">Failed to load timesheets. Please ensure the backend is running.</p>
                <button
                  onClick={() => mutate()}
                  className="mt-3 text-sm text-blue-600 hover:underline"
                >
                  Try again
                </button>
              </div>
            ) : (
              <>
                <TimesheetTable
                  timesheets={data?.data ?? []}
                  onOpenModal={setModalTimesheetId}
                />

                {data && data.totalPages > 0 && (
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
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-4 text-xs text-gray-400">
        © 2024 tentwenty. All rights reserved.
      </footer>

      {/* Add/Edit Entry Modal */}
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
