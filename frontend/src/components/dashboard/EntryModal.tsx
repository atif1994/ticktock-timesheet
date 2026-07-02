'use client';

import { useEffect, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { addEntry } from '@/hooks/useTimesheets';

// Modal schema — no date field (date comes from context)
const modalSchema = z.object({
  projectName: z.string().min(1, 'Project is required'),
  typeOfWork: z.string().min(1, 'Type of work is required'),
  taskDescription: z.string().min(1, 'Task description is required'),
  hours: z.number().min(0.5, 'Minimum 0.5 hours').max(24, 'Maximum 24 hours'),
});

type ModalInput = z.infer<typeof modalSchema>;

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
  'Bug fixes',
  'Code Review',
  'Documentation',
];

interface Props {
  timesheetId: string;
  defaultDate?: string;
  onClose: () => void;
  onSuccess: () => void;
}

function InfoIcon() {
  return (
    <span className="inline-flex items-center justify-center h-4 w-4 rounded-full border border-gray-400 text-gray-400 text-[10px] font-bold cursor-help ml-1">
      i
    </span>
  );
}

export default function EntryModal({ timesheetId, defaultDate, onClose, onSuccess }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<ModalInput>({
    resolver: zodResolver(modalSchema),
    defaultValues: { hours: 8 },
  });

  const hours = watch('hours') ?? 8;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  function handleBackdrop(e: React.MouseEvent) {
    if (e.target === overlayRef.current) onClose();
  }

  function adjustHours(delta: number) {
    const next = Math.min(24, Math.max(0.5, (hours ?? 8) + delta));
    setValue('hours', parseFloat(next.toFixed(1)));
  }

  async function onSubmit(data: ModalInput) {
    try {
      const date = defaultDate ?? new Date().toISOString().split('T')[0];
      await addEntry(timesheetId, { ...data, date });
      onSuccess();
      onClose();
    } catch (err) {
      setError('root', {
        message: err instanceof Error ? err.message : 'Something went wrong',
      });
    }
  }

  return (
    <div
      ref={overlayRef}
      onClick={handleBackdrop}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 id="modal-title" className="text-base font-semibold text-gray-900">
            Add New Entry
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
            aria-label="Close"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-5 space-y-5">

          {/* Select Project */}
          <div>
            <label htmlFor="projectName" className="flex items-center text-sm font-medium text-gray-800 mb-1.5">
              Select Project <span className="text-red-500 ml-0.5">*</span>
              <InfoIcon />
            </label>
            <select
              id="projectName"
              {...register('projectName')}
              className={`w-full rounded-lg border px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 ${
                errors.projectName ? 'border-red-400' : 'border-gray-300'
              }`}
            >
              <option value="">Project Name</option>
              {PROJECTS.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
            {errors.projectName && <p className="mt-1 text-xs text-red-500">{errors.projectName.message}</p>}
          </div>

          {/* Type of Work */}
          <div>
            <label htmlFor="typeOfWork" className="flex items-center text-sm font-medium text-gray-800 mb-1.5">
              Type of Work <span className="text-red-500 ml-0.5">*</span>
              <InfoIcon />
            </label>
            <select
              id="typeOfWork"
              {...register('typeOfWork')}
              className={`w-full rounded-lg border px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 ${
                errors.typeOfWork ? 'border-red-400' : 'border-gray-300'
              }`}
            >
              <option value="">Bug fixes</option>
              {WORK_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            {errors.typeOfWork && <p className="mt-1 text-xs text-red-500">{errors.typeOfWork.message}</p>}
          </div>

          {/* Task description */}
          <div>
            <label htmlFor="taskDescription" className="block text-sm font-medium text-gray-800 mb-1.5">
              Task description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="taskDescription"
              rows={4}
              placeholder="Write text here ..."
              {...register('taskDescription')}
              className={`w-full resize-none rounded-lg border px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 ${
                errors.taskDescription ? 'border-red-400' : 'border-gray-300'
              }`}
            />
            <p className="mt-1 text-xs text-gray-400">A note for extra info</p>
            {errors.taskDescription && <p className="text-xs text-red-500">{errors.taskDescription.message}</p>}
          </div>

          {/* Hours stepper */}
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">
              Hours <span className="text-red-500">*</span>
            </label>
            <Controller
              name="hours"
              control={control}
              render={({ field }) => (
                <div className="flex items-center gap-0">
                  <button
                    type="button"
                    onClick={() => adjustHours(-1)}
                    className="flex h-9 w-9 items-center justify-center rounded-l-lg bg-gray-900 text-white text-lg font-bold hover:bg-gray-700 transition"
                  >
                    −
                  </button>
                  <div className="flex h-9 w-12 items-center justify-center border-y border-gray-300 text-sm font-semibold text-gray-900 bg-white">
                    {field.value}
                  </div>
                  <button
                    type="button"
                    onClick={() => adjustHours(1)}
                    className="flex h-9 w-9 items-center justify-center rounded-r-lg border border-gray-300 text-gray-700 text-lg font-bold hover:bg-gray-50 transition"
                  >
                    +
                  </button>
                </div>
              )}
            />
            {errors.hours && <p className="mt-1 text-xs text-red-500">{errors.hours.message}</p>}
          </div>

          {/* Root error */}
          {errors.root && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 border border-red-200">
              {errors.root.message}
            </p>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
            >
              {isSubmitting ? 'Saving…' : 'Add entry'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-gray-300 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
