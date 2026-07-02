import { TimesheetStatus } from '@/types';

const CONFIG: Record<TimesheetStatus, { label: string; className: string }> = {
  COMPLETED: {
    label: 'COMPLETED',
    className: 'bg-emerald-50 text-emerald-600 border border-emerald-200',
  },
  INCOMPLETE: {
    label: 'INCOMPLETE',
    className: 'bg-amber-50 text-amber-600 border border-amber-200',
  },
  MISSING: {
    label: 'MISSING',
    className: 'bg-rose-50 text-rose-500 border border-rose-200',
  },
};

interface Props {
  status: TimesheetStatus;
}

export default function StatusBadge({ status }: Props) {
  const { label, className } = CONFIG[status];
  return (
    <span
      className={`inline-block rounded-full px-3 py-0.5 text-xs font-semibold tracking-wide ${className}`}
    >
      {label}
    </span>
  );
}
