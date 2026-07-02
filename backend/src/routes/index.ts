import { Router } from 'express';
import timesheetsRouter from './timesheets.routes';

const router = Router();

router.use('/timesheets', timesheetsRouter);

export default router;
