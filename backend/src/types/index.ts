// ---------------------------------------------------------------------------
// Domain types shared across the backend
// ---------------------------------------------------------------------------

export type TimesheetStatus = 'COMPLETED' | 'INCOMPLETE' | 'MISSING';

export interface TimesheetEntry {
  id: string;
  date: string; // ISO-8601 date, e.g. "2024-01-15"
  projectName: string;
  typeOfWork: string;
  taskDescription: string;
  hours: number;
  notes?: string;
}

export interface Timesheet {
  id: string;
  weekNumber: number;
  startDate: string; // ISO-8601 date
  endDate: string;   // ISO-8601 date
  status: TimesheetStatus;
  totalHours: number;
  entries: TimesheetEntry[];
}

// ---------------------------------------------------------------------------
// API request / response shapes
// ---------------------------------------------------------------------------

export interface CreateEntryDto {
  date: string;
  projectName: string;
  typeOfWork: string;
  taskDescription: string;
  hours: number;
  notes?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export interface ListTimesheetsQuery {
  page?: string;
  perPage?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface ApiError {
  error: string;
  details?: unknown;
}
