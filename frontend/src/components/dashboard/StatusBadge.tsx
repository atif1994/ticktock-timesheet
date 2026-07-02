import { TimesheetStatus } from '@/types';

const CONFIG: Record<
  TimesheetStatus,
  { label: string; className: string }
> = {
  COMPLETED: {
    label: 'COMPLETED',
    className: 'bg-green-100 text-green-700',
  },
  INCOMPLETE: {
    label: 'INCOMPLETE',
    className: 'bg-orange-100 text-orange-600',
  },
  MISSING: {
    label: 'MISSING',
    className: 'bg-red-100 text-red-500',
  },
};

interface Props {
  status: TimesheetStatus;
}

export default function StatusBadge({ status }: Props) {
  const { label, className } = CONFIG[status];
  return (
    <span
      className={`inline-block rounded px-2.5 py-0.5 text-xs font-semibold tracking-wide ${className}`}
    >
      {label}
    </span>
  );
}
