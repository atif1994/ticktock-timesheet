'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/dashboard/Header';
import StatusBadge from '@/components/dashboard/StatusBadge';
import EntryModal from '@/components/dashboard/EntryModal';
import { useTimesheet } from '@/hooks/useTimesheets';
import { TimesheetEntry } from '@/types';

interface PageProps {
  params: Promise<{ id: string }>;
}

function groupEntriesByDate(entries: TimesheetEntry[]): Record<string, TimesheetEntry[]> {
  return entries.reduce<Record<string, TimesheetEntry[]>>((acc, entry) => {
    if (!acc[entry.date]) acc[entry.date] = [];
    acc[entry.date].push(entry);
    return acc;
  }, {});
}

function formatDay(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-GB', { weekday: 'short', month: 'short', day: 'numeric' });
}

function formatDateRange(start: string, end: string): string {
  const s = new Date(start + 'T00:00:00');
  const e = new Date(end + 'T00:00:00');
  return `${s.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} – ${e.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`;
}

export default function TimesheetDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const { timesheet, isLoading, mutate } = useTimesheet(id);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | undefined>();

  function openModalForDate(date: string) {
    setSelectedDate(date);
    setModalOpen(true);
  }

  if (isLoading) {
    return (
      <>
        <Header breadcrumb="Timesheets" />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-gray-400 text-sm">Loading…</p>
        </main>
      </>
    );
  }

  if (!timesheet) {
    return (
      <>
        <Header breadcrumb="Timesheets" />
        <main className="flex-1 flex flex-col items-center justify-center gap-4">
          <p className="text-gray-500">Timesheet not found.</p>
          <Link href="/dashboard" className="text-blue-600 hover:underline text-sm">
            ← Back to Timesheets
          </Link>
        </main>
      </>
    );
  }

  const grouped = groupEntriesByDate(timesheet.entries);
  const maxHours = 40;
  const progressPct = Math.min(100, (timesheet.totalHours / maxHours) * 100);

  return (
    <>
      <Header breadcrumb="Timesheets" />

      <main className="flex-1 px-3 py-4 sm:px-6 sm:py-8">
        <div className="mx-auto max-w-3xl">
          {/* Back link */}
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-4 transition"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Timesheets
          </Link>

          <div className="rounded-xl bg-white shadow-sm border border-gray-100 px-4 py-5 sm:px-6 sm:py-6">
            {/* Week header */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between mb-2">
              <div>
                <h1 className="text-base font-semibold text-gray-900">
                  This week&rsquo;s timesheet
                </h1>
                <p className="text-sm text-gray-500 mt-0.5">
                  {formatDateRange(timesheet.startDate, timesheet.endDate)}
                </p>
              </div>
              <div className="flex items-center gap-2 self-start">
                <StatusBadge status={timesheet.status} />
                <span className="text-sm text-gray-500 font-medium">
                  {timesheet.totalHours}/40 hrs
                </span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full h-1.5 bg-gray-100 rounded-full mb-6 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  timesheet.status === 'COMPLETED'
                    ? 'bg-green-500'
                    : timesheet.status === 'INCOMPLETE'
                    ? 'bg-orange-400'
                    : 'bg-red-400'
                }`}
                style={{ width: `${progressPct}%` }}
              />
            </div>

            {/* Daily entries */}
            <div className="space-y-5">
              {Array.from({ length: 5 }, (_, i) => {
                const d = new Date(timesheet.startDate + 'T00:00:00');
                d.setDate(d.getDate() + i);
                const dateStr = d.toISOString().split('T')[0];
                const dayEntries = grouped[dateStr] ?? [];

                return (
                  <div key={dateStr}>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                      {formatDay(dateStr)}
                    </p>

                    {dayEntries.length > 0 ? (
                      <div className="space-y-2">
                        {dayEntries.map((entry) => (
                          <div
                            key={entry.id}
                            className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between rounded-lg border border-gray-100 bg-gray-50 px-4 py-3"
                          >
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-gray-800">
                                {entry.taskDescription}
                              </p>
                              <p className="text-xs text-gray-400 mt-0.5">{entry.typeOfWork}</p>
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs text-gray-500">{entry.hours} hrs</span>
                              <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-600">
                                {entry.projectName}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : null}

                    {/* Add new task */}
                    {timesheet.status !== 'COMPLETED' && (
                      <button
                        onClick={() => openModalForDate(dateStr)}
                        className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-blue-300 py-2.5 text-sm font-medium text-blue-500 hover:bg-blue-50 transition"
                      >
                        <span className="text-base leading-none">+</span>
                        Add new task
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      {modalOpen && (
        <EntryModal
          timesheetId={timesheet.id}
          defaultDate={selectedDate}
          onClose={() => setModalOpen(false)}
          onSuccess={() => mutate()}
        />
      )}
    </>
  );
}
