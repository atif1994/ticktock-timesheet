'use client';

import { useEffect, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { entrySchema, EntryInput } from '@/lib/validations';
import { addEntry } from '@/hooks/useTimesheets';

const PROJECTS = [
  'Homepage Development',
  'API Integration',
  'Design System',
  'Mobile App',
  'Client Portal',
];

const WORK_TYPES = [
  'Development',
  'Design',
  'Testing',
  'Code Review',
  'Documentation',
];

interface Props {
  timesheetId: string;
  /** Pre-selected date (ISO string) — optional */
  defaultDate?: string;
  onClose: () => void;
  /** Called with the updated timesheet after a successful save */
  onSuccess: () => void;
}

export default function EntryModal({
  timesheetId,
  defaultDate,
  onClose,
  onSuccess,
}: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<EntryInput>({
    resolver: zodResolver(entrySchema),
    defaultValues: {
      date: defaultDate ?? new Date().toISOString().split('T')[0],
      hours: 8,
    },
  });

  const hours = watch('hours') ?? 8;

  // Close on Escape key
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  // Trap focus within modal — close on backdrop click
  function handleBackdrop(e: React.MouseEvent) {
    if (e.target === overlayRef.current) onClose();
  }

  async function onSubmit(data: EntryInput) {
    try {
      await addEntry(timesheetId, data);
      onSuccess();
      onClose();
    } catch (err) {
      setError('root', {
        message: err instanceof Error ? err.message : 'Something went wrong',
      });
    }
  }

  function adjustHours(delta: number) {
    const next = Math.min(24, Math.max(0.5, (hours ?? 8) + delta));
    setValue('hours', parseFloat(next.toFixed(1)));
  }

  return (
    <div
      ref={overlayRef}
      onClick={handleBackdrop}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="w-full max-w-md rounded-xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 id="modal-title" className="text-base font-semibold text-gray-900">
            Add New Entry
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
            aria-label="Close modal"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-5 space-y-4">
          {/* Date */}
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              Date <span className="text-red-500">*</span>
            </label>
            <input
              id="date"
              type="date"
              {...register('date')}
              className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 ${
                errors.date ? 'border-red-400' : 'border-gray-300'
              }`}
            />
            {errors.date && <p className="mt-1 text-xs text-red-500">{errors.date.message}</p>}
          </div>

          {/* Select Project */}
          <div>
            <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 mb-1">
              Select Project <span className="text-red-500">*</span>
            </label>
            <select
              id="projectName"
              {...register('projectName')}
              className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 ${
                errors.projectName ? 'border-red-400' : 'border-gray-300'
              }`}
            >
              <option value="">Project Name</option>
              {PROJECTS.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            {errors.projectName && (
              <p className="mt-1 text-xs text-red-500">{errors.projectName.message}</p>
            )}
          </div>

          {/* Type of Work */}
          <div>
            <label htmlFor="typeOfWork" className="block text-sm font-medium text-gray-700 mb-1">
              Type of Work <span className="text-red-500">*</span>
            </label>
            <select
              id="typeOfWork"
              {...register('typeOfWork')}
              className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 ${
                errors.typeOfWork ? 'border-red-400' : 'border-gray-300'
              }`}
            >
              <option value="">Select type</option>
              {WORK_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            {errors.typeOfWork && (
              <p className="mt-1 text-xs text-red-500">{errors.typeOfWork.message}</p>
            )}
          </div>

          {/* Task description */}
          <div>
            <label htmlFor="taskDescription" className="block text-sm font-medium text-gray-700 mb-1">
              Task description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="taskDescription"
              rows={3}
              placeholder="Write task here..."
              {...register('taskDescription')}
              className={`w-full resize-none rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 ${
                errors.taskDescription ? 'border-red-400' : 'border-gray-300'
              }`}
            />
            {errors.taskDescription && (
              <p className="mt-1 text-xs text-red-500">{errors.taskDescription.message}</p>
            )}
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <input
              id="notes"
              type="text"
              placeholder="A note for extra info"
              {...register('notes')}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>

          {/* Hours stepper */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hours <span className="text-red-500">*</span>
            </label>
            <Controller
              name="hours"
              control={control}
              render={({ field }) => (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => adjustHours(-0.5)}
                    className="flex h-8 w-8 items-center justify-center rounded border border-gray-300 text-gray-600 hover:bg-gray-100 transition font-semibold"
                  >
                    −
                  </button>
                  <span className="w-10 text-center text-sm font-medium text-gray-900">
                    {field.value}
                  </span>
                  <button
                    type="button"
                    onClick={() => adjustHours(0.5)}
                    className="flex h-8 w-8 items-center justify-center rounded border border-gray-300 text-gray-600 hover:bg-gray-100 transition font-semibold"
                  >
                    +
                  </button>
                </div>
              )}
            />
            {errors.hours && (
              <p className="mt-1 text-xs text-red-500">{errors.hours.message}</p>
            )}
          </div>

          {/* Root / server error */}
          {errors.root && (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600 border border-red-200">
              {errors.root.message}
            </p>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 rounded-md bg-blue-600 py-2 text-sm font-semibold text-white hover:bg-blue-700 active:bg-blue-800 disabled:opacity-60 disabled:cursor-not-allowed transition"
            >
              {isSubmitting ? 'Saving…' : 'Add entry'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-md border border-gray-300 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
