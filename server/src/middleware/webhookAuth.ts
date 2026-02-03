import { Request, Response, NextFunction } from 'express';
import { logger } from '../lib/logger';
import { validateTavusSignature, validateRetellSignature } from '../lib/secrets';

/**
 * Webhook Authentication Middleware
 *
 * Validates webhook signatures to prevent:
 * - Fake webhooks from attackers
 * - Replay attacks (using timestamp validation)
 */

/**
 * Validate Tavus webhook requests
 */
export const validateTavusWebhook = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const signature = req.headers['x-tavus-signature'] as string | undefined;
  const timestamp = req.headers['x-tavus-timestamp'] as string | undefined;

  // Store raw body for signature validation
  const rawBody = JSON.stringify(req.body);

  const result = validateTavusSignature(signature, timestamp, rawBody);

  if (!result.valid) {
    logger.warn('❌ Invalid Tavus webhook signature', {
      error: result.error,
      sourceIP: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return res.status(401).json({
      error: 'Unauthorized',
      message: result.error,
    });
  }

  next();
};

/**
 * Validate Retell webhook requests
 */
export const validateRetellWebhook = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const signature = req.headers['x-retell-signature'] as string | undefined;
  const timestamp = req.headers['x-retell-timestamp'] as string | undefined;

  const rawBody = JSON.stringify(req.body);

  const result = validateRetellSignature(signature, timestamp, rawBody);

  if (!result.valid) {
    logger.warn('❌ Invalid Retell webhook signature', {
      error: result.error,
      sourceIP: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return res.status(401).json({
      error: 'Unauthorized',
      message: result.error,
    });
  }

  next();
};

/**
 * Generic rate limiting for webhooks
 * (Works with express-rate-limit)
 */
export const webhookRateLimitConfig = {
  windowMs: 60 * 1000, // 1 minute
  max: 500, // 500 requests per minute per IP
  message: {
    error: 'Too many webhook requests',
    retryAfter: 60,
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: Request) => {
    // Use X-Forwarded-For if behind proxy, else use IP
    return (req.headers['x-forwarded-for'] as string)?.split(',')[0] || req.ip || 'unknown';
  },
};
