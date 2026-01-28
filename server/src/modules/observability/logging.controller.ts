
import { Router, Request, Response } from 'express';
import { logger } from '../../lib/logger';

const router = Router();

// Generic Log Endpoint (Bridge for Frontend)
router.post('/log', (req: Request, res: Response) => {
  const { level, message, metadata } = req.body;

  // Validate Level (Security: Don't allow arbitrary levels if sensitive)
  const validLevels = ['info', 'warn', 'error', 'debug'];
  const logLevel = validLevels.includes(level) ? level : 'info';

  // Log it
  // We tag it as 'source: frontend' so we can filter in Grafana
  // { app: 'voxaris-frontend' }
  const logMeta = { ...metadata, source: 'frontend' };
  
  // Dynamic call: logger.info, logger.warn, etc.
  (logger as any)[logLevel](message, logMeta);

  return res.sendStatus(200);
});

export default router;
