import { Request, Response, NextFunction } from 'express';
import { logger } from '../../lib/logger';

/**
 * Admin Authentication Middleware
 *
 * Validates admin API key for internal tools and Cowork access.
 * Uses Bearer token authentication.
 *
 * Header: Authorization: Bearer VOXARIS_ADMIN_KEY
 */

const ADMIN_KEY = process.env.VOXARIS_ADMIN_KEY;

export interface AdminRequest extends Request {
  adminId?: string;
  correlationId?: string;
}

export const adminAuth = (
  req: AdminRequest,
  res: Response,
  next: NextFunction
) => {
  // Generate correlation ID for request tracing
  const correlationId = req.headers['x-correlation-id'] as string ||
    `admin-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  req.correlationId = correlationId;
  res.setHeader('x-correlation-id', correlationId);

  // Check if admin key is configured
  if (!ADMIN_KEY) {
    logger.error('VOXARIS_ADMIN_KEY not configured', { correlationId });
    return res.status(500).json({
      success: false,
      error: 'Admin API not configured',
      code: 'ADMIN_NOT_CONFIGURED',
    });
  }

  // Extract Bearer token
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    logger.warn('Admin auth failed: Missing or invalid Authorization header', {
      correlationId,
      ip: req.ip,
    });
    return res.status(401).json({
      success: false,
      error: 'Missing or invalid Authorization header',
      code: 'UNAUTHORIZED',
    });
  }

  const token = authHeader.slice(7); // Remove 'Bearer ' prefix

  // Validate token
  if (token !== ADMIN_KEY) {
    logger.warn('Admin auth failed: Invalid API key', {
      correlationId,
      ip: req.ip,
      tokenPrefix: token.slice(0, 8) + '...', // Log first 8 chars only
    });
    return res.status(401).json({
      success: false,
      error: 'Invalid API key',
      code: 'INVALID_API_KEY',
    });
  }

  // Auth successful
  req.adminId = 'voxaris-admin';
  logger.debug('Admin auth successful', { correlationId });

  next();
};

/**
 * Rate limiter config for admin endpoints
 * More generous than public endpoints since only internal tools use this
 */
export const adminRateLimitConfig = {
  windowMs: 60 * 1000, // 1 minute
  max: 1000, // 1000 requests per minute
  message: {
    success: false,
    error: 'Admin API rate limit exceeded',
    code: 'RATE_LIMIT_EXCEEDED',
  },
  standardHeaders: true,
  legacyHeaders: false,
};
