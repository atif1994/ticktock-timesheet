import { Request, Response, NextFunction } from 'express';
import * as store from '../data/store';
import { CreateEntryDto, ListTimesheetsQuery } from '../types';

/**
 * GET /api/timesheets
 * Returns a paginated, filterable list of timesheets.
 */
export function listTimesheets(req: Request, res: Response, next: NextFunction): void {
  try {
    const query = req.query as ListTimesheetsQuery;

    const page = Math.max(1, parseInt(query.page ?? '1', 10));
    const perPage = Math.min(100, Math.max(1, parseInt(query.perPage ?? '5', 10)));

    const result = store.findAll({
      page,
      perPage,
      status: query.status,
      dateFrom: query.dateFrom,
      dateTo: query.dateTo,
    });

    res.json(result);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/timesheets/:id
 * Returns a single timesheet with its entries.
 */
export function getTimesheet(req: Request, res: Response, next: NextFunction): void {
  try {
    const timesheet = store.findById(req.params.id);

    if (!timesheet) {
      res.status(404).json({ error: 'Timesheet not found' });
      return;
    }

    res.json(timesheet);
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/timesheets/:id/entries
 * Adds a new entry to the given timesheet week.
 * Recalculates total hours and status automatically.
 */
export function createEntry(req: Request, res: Response, next: NextFunction): void {
  try {
    const dto: CreateEntryDto = req.body;

    // Basic server-side validation
    const requiredFields: (keyof CreateEntryDto)[] = [
      'date',
      'projectName',
      'typeOfWork',
      'taskDescription',
      'hours',
    ];

    const missing = requiredFields.filter((f) => !dto[f] && dto[f] !== 0);
    if (missing.length > 0) {
      res.status(422).json({
        error: 'Validation failed',
        details: { missing },
      });
      return;
    }

    if (typeof dto.hours !== 'number' || dto.hours < 0.5 || dto.hours > 24) {
      res.status(422).json({
        error: 'Validation failed',
        details: { hours: 'Must be a number between 0.5 and 24' },
      });
      return;
    }

    const updated = store.addEntry(req.params.id, dto);

    if (!updated) {
      res.status(404).json({ error: 'Timesheet not found' });
      return;
    }

    res.status(201).json(updated);
  } catch (err) {
    next(err);
  }
}
