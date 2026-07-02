import useSWR from 'swr';
import { PaginatedTimesheets, Timesheet, TimesheetFilters, CreateEntryInput } from '@/types';

const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error('Network error');
    return res.json();
  });

// ---------------------------------------------------------------------------
// Paginated list of timesheets
// ---------------------------------------------------------------------------
export function useTimesheets(filters: TimesheetFilters = {}) {
  const { page = 1, perPage = 5, status, dateFrom, dateTo } = filters;

  const params = new URLSearchParams({ page: String(page), perPage: String(perPage) });
  if (status && status !== 'all') params.set('status', status);
  if (dateFrom) params.set('dateFrom', dateFrom);
  if (dateTo) params.set('dateTo', dateTo);

  const { data, error, isLoading, mutate } = useSWR<PaginatedTimesheets>(
    `/api/timesheets?${params}`,
    fetcher
  );

  return { data, error, isLoading, mutate };
}

// ---------------------------------------------------------------------------
// Single timesheet (for detail view)
// ---------------------------------------------------------------------------
export function useTimesheet(id: string | null) {
  const { data, error, isLoading, mutate } = useSWR<Timesheet>(
    id ? `/api/timesheets/${id}` : null,
    fetcher
  );

  return { timesheet: data, error, isLoading, mutate };
}

// ---------------------------------------------------------------------------
// Add entry to a timesheet (used by the modal)
// ---------------------------------------------------------------------------
export async function addEntry(
  timesheetId: string,
  input: CreateEntryInput
): Promise<Timesheet> {
  const res = await fetch(`/api/timesheets/${timesheetId}/entries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.error ?? 'Failed to add entry');
  }

  return res.json();
}
