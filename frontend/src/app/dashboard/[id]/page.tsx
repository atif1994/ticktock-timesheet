'use client';

import { use, useState, useRef, useEffect } from 'react';
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
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatDateRange(start: string, end: string): string {
  const s = new Date(start + 'T00:00:00');
  const e = new Date(end + 'T00:00:00');
  const startDay = s.getDate();
  const endDay = e.getDate();
  const month = s.toLocaleString('en-US', { month: 'long' });
  const year = s.getFullYear();
  if (s.getMonth() === e.getMonth()) return `${startDay} – ${endDay} ${month}, ${year}`;
  return `${s.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })} – ${e.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}`;
}

// Three-dots action menu per entry row
function EntryMenu({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-center h-7 w-7 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition"
        aria-label="More options"
      >
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-8 z-20 w-28 rounded-lg border border-gray-100 bg-white py-1 shadow-lg">
          <button
            onClick={() => { onEdit(); setOpen(false); }}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
          >
            Edit
          </button>
          <button
            onClick={() => { onDelete(); setOpen(false); }}
            className="w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
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
          <Link href="/dashboard" className="text-blue-600 hover:underline text-sm">← Back</Link>
        </main>
      </>
    );
  }

  const grouped = groupEntriesByDate(timesheet.entries);
  const progressPct = Math.min(100, (timesheet.totalHours / 40) * 100);

  return (
    <>
      <Header breadcrumb="Timesheets" />

      <main className="flex-1 px-3 py-4 sm:px-6 sm:py-8">
        <div className="mx-auto max-w-3xl">
          {/* Back */}
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
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between mb-1">
              <h1 className="text-base font-semibold text-gray-900">
                This week&rsquo;s timesheet
              </h1>
              <div className="flex items-center gap-3 self-start">
                {/* Hours progress */}
                <span className="text-sm font-semibold text-gray-700">
                  {timesheet.totalHours}/40 hrs
                </span>
                <span className="text-xs text-gray-400">{Math.round(progressPct)}%</span>
              </div>
            </div>

            <p className="text-xs text-gray-400 mb-3">
              {formatDateRange(timesheet.startDate, timesheet.endDate)}
            </p>

            {/* Progress bar */}
            <div className="w-full h-1.5 bg-gray-100 rounded-full mb-6 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  timesheet.status === 'COMPLETED' ? 'bg-blue-500'
                  : timesheet.status === 'INCOMPLETE' ? 'bg-orange-400'
                  : 'bg-red-400'
                }`}
                style={{ width: `${progressPct}%` }}
              />
            </div>

            {/* Daily entries */}
            <div className="space-y-6">
              {Array.from({ length: 5 }, (_, i) => {
                const d = new Date(timesheet.startDate + 'T00:00:00');
                d.setDate(d.getDate() + i);
                const dateStr = d.toISOString().split('T')[0];
                const dayEntries = grouped[dateStr] ?? [];

                return (
                  <div key={dateStr}>
                    <p className="text-sm font-semibold text-gray-800 mb-2">
                      {formatDay(dateStr)}
                    </p>

                    {dayEntries.length > 0 && (
                      <div className="space-y-1 mb-2">
                        {dayEntries.map((entry) => (
                          <div
                            key={entry.id}
                            className="flex items-center justify-between rounded-lg border border-gray-100 bg-white px-4 py-3 hover:bg-gray-50 transition"
                          >
                            <span className="text-sm text-gray-800 truncate flex-1 min-w-0 mr-4">
                              {entry.taskDescription}
                            </span>
                            <div className="flex items-center gap-3 shrink-0">
                              <span className="text-xs text-gray-500">{entry.hours} hrs</span>
                              <span className="rounded-full bg-blue-50 border border-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-600">
                                {entry.projectName}
                              </span>
                              <EntryMenu
                                onEdit={() => openModalForDate(dateStr)}
                                onDelete={() => {
                                  // Delete is UI-only for now (no delete API yet)
                                  alert('Delete coming soon');
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add new task button */}
                    <button
                      onClick={() => openModalForDate(dateStr)}
                      className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-blue-400 py-2.5 text-sm font-medium text-blue-500 hover:bg-blue-50 transition"
                    >
                      + Add new task
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-4 text-xs text-gray-400">
        © 2024 tentwenty. All rights reserved.
      </footer>

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
