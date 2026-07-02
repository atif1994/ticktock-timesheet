import express, { Application } from 'express';
import cors from 'cors';
import { validateSecret } from './middleware/validateSecret';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import apiRouter from './routes';

export function createApp(): Application {
  const app = express();

  // ── Core middleware ────────────────────────────────────────────────────────
  app.use(cors({ origin: process.env.FRONTEND_URL ?? 'http://localhost:3000' }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // ── Health check (no auth required) ───────────────────────────────────────
  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // ── API routes (protected by shared secret) ────────────────────────────────
  app.use('/api', validateSecret, apiRouter);

  // ── Error handlers (must be last) ─────────────────────────────────────────
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
