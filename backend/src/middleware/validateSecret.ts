import { Request, Response, NextFunction } from 'express';

/**
 * Validates the shared internal API secret sent from the Next.js frontend.
 * Prevents direct public access to the backend API.
 *
 * The frontend must include the header:
 *   x-internal-secret: <INTERNAL_API_SECRET>
 */
export function validateSecret(req: Request, res: Response, next: NextFunction): void {
  const secret = process.env.INTERNAL_API_SECRET;

  // Skip validation if no secret is configured (e.g. local dev without the env var)
  if (!secret) {
    next();
    return;
  }

  const incomingSecret = req.headers['x-internal-secret'];

  if (incomingSecret !== secret) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  next();
}
