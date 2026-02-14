/**
 * Sentry Error Monitoring Integration
 *
 * Captures and reports errors to Sentry for monitoring.
 * Configured via SENTRY_DSN environment variable.
 */

import * as Sentry from '@sentry/node';
import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const SENTRY_DSN = process.env.SENTRY_DSN;

/**
 * Initialize Sentry
 * Call this early in app startup
 */
export function initSentry() {
  if (!SENTRY_DSN) {
    console.warn('⚠️ SENTRY_DSN not configured. Error monitoring disabled.');
    return false;
  }

  Sentry.init({
    dsn: SENTRY_DSN,
    environment: process.env.NODE_ENV || 'development',
    release: process.env.npm_package_version || '1.0.0',

    // Performance monitoring
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.2 : 1.0,

    // Only report errors in production by default
    beforeSend(event) {
      // Filter out noisy errors if needed
      if (event.exception?.values?.[0]?.type === 'OperationalError') {
        return null; // Don't send operational errors
      }
      return event;
    },

    // Integrations
    integrations: [
      Sentry.httpIntegration(),
      Sentry.expressIntegration(),
    ],
  });

  console.log('✅ Sentry initialized');
  return true;
}

/**
 * Capture an exception with context
 */
export function captureError(error: Error, context?: Record<string, any>) {
  if (!SENTRY_DSN) {
    console.error('Error (Sentry disabled):', error.message, context);
    return;
  }

  Sentry.withScope((scope) => {
    if (context) {
      scope.setExtras(context);
    }
    Sentry.captureException(error);
  });
}

/**
 * Set user context for Sentry
 */
export function setUserContext(user: { id?: string; email?: string; phone?: string }) {
  if (!SENTRY_DSN) return;

  Sentry.setUser({
    id: user.id,
    email: user.email,
    phone: user.phone,
  });
}

/**
 * Add breadcrumb for tracking user flow
 */
export function addBreadcrumb(message: string, data?: Record<string, any>) {
  if (!SENTRY_DSN) return;

  Sentry.addBreadcrumb({
    message,
    data,
    level: 'info',
  });
}

/**
 * Express request handler middleware
 * Tracks request context for Sentry
 */
export function sentryRequestHandler(req: Request, res: Response, next: NextFunction) {
  if (!SENTRY_DSN) {
    return next();
  }

  // Add request context to Sentry
  Sentry.setContext('request', {
    method: req.method,
    url: req.url,
    headers: {
      'user-agent': req.headers['user-agent'],
      'content-type': req.headers['content-type'],
    },
  });

  next();
}

/**
 * Express error handler middleware
 * Captures errors and sends to Sentry
 */
export function sentryErrorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  if (!SENTRY_DSN) {
    return next(err);
  }

  Sentry.withScope((scope) => {
    scope.setTag('path', req.path);
    scope.setTag('method', req.method);
    scope.setExtra('body', req.body);
    Sentry.captureException(err);
  });

  next(err);
}

// Re-export Sentry for direct access if needed
export { Sentry };
