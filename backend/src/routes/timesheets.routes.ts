import { Router } from 'express';
import {
  listTimesheets,
  getTimesheet,
  createEntry,
} from '../controllers/timesheets.controller';

const router = Router();

router.get('/', listTimesheets);
router.get('/:id', getTimesheet);
router.post('/:id/entries', createEntry);

export default router;
