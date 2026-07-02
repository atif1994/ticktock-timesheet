export type TimesheetStatus = 'COMPLETED' | 'INCOMPLETE' | 'MISSING';

export interface TimesheetEntry {
  id: string;
  date: string; // ISO date string e.g. "2024-01-01"
  projectName: string;
  typeOfWork: string;
  taskDescription: string;
  hours: number;
  notes?: string;
}

export interface Timesheet {
  id: string;
  weekNumber: number;
  startDate: string;
  endDate: string;
  status: TimesheetStatus;
  totalHours: number;
  entries: TimesheetEntry[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export type PaginatedTimesheets = PaginatedResponse<Timesheet>;

export interface CreateEntryInput {
  date: string;
  projectName: string;
  typeOfWork: string;
  taskDescription: string;
  hours: number;
  notes?: string;
}

export interface TimesheetFilters {
  status?: TimesheetStatus | 'all';
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  perPage?: number;
}
