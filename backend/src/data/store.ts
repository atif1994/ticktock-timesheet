/**
 * In-memory data store — seeded with 99 weeks of timesheet data.
 *
 * In production this layer would be replaced by a database repository
 * (e.g. Prisma + PostgreSQL). The public interface (getById, list, etc.)
 * would remain the same, making the swap transparent to the controllers.
 */

import { Timesheet, TimesheetEntry, TimesheetStatus, CreateEntryDto } from '../types';

// ---------------------------------------------------------------------------
// Seed helpers
// ---------------------------------------------------------------------------

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function toISODate(date: Date): string {
  return date.toISOString().split('T')[0];
}

function deriveStatus(totalHours: number): TimesheetStatus {
  if (totalHours >= 40) return 'COMPLETED';
  if (totalHours > 0) return 'INCOMPLETE';
  return 'MISSING';
}

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

function makeEntries(weekStart: Date, count: number): TimesheetEntry[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `entry-${weekStart.getTime()}-${i}`,
    date: toISODate(addDays(weekStart, Math.floor(i / 2))),
    projectName: PROJECTS[i % PROJECTS.length],
    typeOfWork: WORK_TYPES[i % WORK_TYPES.length],
    taskDescription: `${WORK_TYPES[i % WORK_TYPES.length]} tasks for ${PROJECTS[i % PROJECTS.length]}`,
    hours: 8,
  }));
}

// Status pattern repeats every 5 weeks for a realistic distribution
const STATUS_PATTERN: TimesheetStatus[] = [
  'COMPLETED',
  'COMPLETED',
  'INCOMPLETE',
  'COMPLETED',
  'MISSING',
];

function seedTimesheets(): Timesheet[] {
  const origin = new Date('2024-01-01'); // Monday

  return Array.from({ length: 99 }, (_, i) => {
    const weekStart = addDays(origin, i * 7);
    const weekEnd = addDays(weekStart, 4); // Monday → Friday
    const status = STATUS_PATTERN[i % STATUS_PATTERN.length];

    let entries: TimesheetEntry[] = [];
    let totalHours = 0;

    if (status === 'COMPLETED') {
      entries = makeEntries(weekStart, 5); // 5 × 8 h = 40 h
      totalHours = 40;
    } else if (status === 'INCOMPLETE') {
      entries = makeEntries(weekStart, 2); // 2 × 8 h = 16 h
      totalHours = 16;
    }

    return {
      id: `timesheet-${i + 1}`,
      weekNumber: i + 1,
      startDate: toISODate(weekStart),
      endDate: toISODate(weekEnd),
      status,
      totalHours,
      entries,
    };
  });
}

// ---------------------------------------------------------------------------
// In-memory store
// ---------------------------------------------------------------------------

let timesheets: Timesheet[] = seedTimesheets();

// ---------------------------------------------------------------------------
// Public store interface
// ---------------------------------------------------------------------------

export interface ListOptions {
  page: number;
  perPage: number;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
}

export function findAll(options: ListOptions) {
  const { page, perPage, status, dateFrom, dateTo } = options;

  let filtered = [...timesheets];

  if (status && status !== 'all') {
    filtered = filtered.filter((t) => t.status === status);
  }
  if (dateFrom) {
    filtered = filtered.filter((t) => t.startDate >= dateFrom);
  }
  if (dateTo) {
    filtered = filtered.filter((t) => t.endDate <= dateTo);
  }

  const total = filtered.length;
  const totalPages = Math.ceil(total / perPage);
  const start = (page - 1) * perPage;
  const data = filtered.slice(start, start + perPage);

  return { data, total, page, perPage, totalPages };
}

export function findById(id: string): Timesheet | undefined {
  return timesheets.find((t) => t.id === id);
}

export function addEntry(timesheetId: string, dto: CreateEntryDto): Timesheet | null {
  const idx = timesheets.findIndex((t) => t.id === timesheetId);
  if (idx === -1) return null;

  const newEntry: TimesheetEntry = {
    id: `entry-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    ...dto,
  };

  const updated = { ...timesheets[idx] };
  updated.entries = [...updated.entries, newEntry];
  updated.totalHours = updated.entries.reduce((sum, e) => sum + e.hours, 0);
  updated.status = deriveStatus(updated.totalHours);

  timesheets[idx] = updated;
  return updated;
}
