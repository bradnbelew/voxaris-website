import { createCipheriv, createDecipheriv, randomBytes, createHmac, timingSafeEqual } from 'crypto';
import { supabase } from './supabase';
import { logger } from './logger';

/**
 * Secrets Manager
 *
 * Handles encryption/decryption of dealer-specific API keys
 * and webhook signature validation.
 *
 * SECURITY:
 * - AES-256-GCM encryption for stored credentials
 * - HMAC-SHA256 for webhook signatures
 * - Timing-safe comparison to prevent timing attacks
 */

// Master encryption key (32 bytes = 64 hex chars)
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;

if (!ENCRYPTION_KEY) {
  console.warn('⚠️ ENCRYPTION_KEY not found. Dealer credential encryption will fail.');
}

export class SecretsManager {
  /**
   * Encrypt sensitive data before storing in database
   * Returns: iv:authTag:encrypted (hex encoded)
   */
  static encrypt(plaintext: string): string {
    if (!ENCRYPTION_KEY) {
      throw new Error('ENCRYPTION_KEY not configured');
    }

    const iv = randomBytes(16);
    const cipher = createCipheriv(
      'aes-256-gcm',
      Buffer.from(ENCRYPTION_KEY, 'hex'),
      iv
    );

    let encrypted = cipher.update(plaintext, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag();

    // Format: iv:authTag:encrypted
    return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
  }

  /**
   * Decrypt sensitive data from database
   */
  static decrypt(ciphertext: string): string {
    if (!ENCRYPTION_KEY) {
      throw new Error('ENCRYPTION_KEY not configured');
    }

    const [ivHex, authTagHex, encrypted] = ciphertext.split(':');

    if (!ivHex || !authTagHex || !encrypted) {
      throw new Error('Invalid ciphertext format');
    }

    const decipher = createDecipheriv(
      'aes-256-gcm',
      Buffer.from(ENCRYPTION_KEY, 'hex'),
      Buffer.from(ivHex, 'hex')
    );

    decipher.setAuthTag(Buffer.from(authTagHex, 'hex'));

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }

  /**
   * Get dealer-specific GHL credentials
   */
  static async getDealerGHLCredentials(dealerId: string): Promise<{
    apiKey: string;
    locationId: string;
  } | null> {
    try {
      const { data, error } = await supabase
        .from('dealer_integrations')
        .select('api_key_encrypted, metadata')
        .eq('dealer_id', dealerId)
        .eq('integration_type', 'ghl')
        .single();

      if (error || !data) {
        logger.warn(`GHL integration not found for dealer: ${dealerId}`);
        return null;
      }

      return {
        apiKey: this.decrypt(data.api_key_encrypted),
        locationId: data.metadata?.location_id || '',
      };
    } catch (err: any) {
      logger.error(`Failed to get GHL credentials for dealer ${dealerId}:`, err.message);
      return null;
    }
  }

  /**
   * Store dealer GHL credentials (encrypted)
   */
  static async storeDealerGHLCredentials(
    dealerId: string,
    apiKey: string,
    locationId: string
  ): Promise<boolean> {
    try {
      const encryptedKey = this.encrypt(apiKey);

      const { error } = await supabase
        .from('dealer_integrations')
        .upsert({
          dealer_id: dealerId,
          integration_type: 'ghl',
          api_key_encrypted: encryptedKey,
          metadata: { location_id: locationId },
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'dealer_id,integration_type'
        });

      if (error) {
        logger.error('Failed to store GHL credentials:', error);
        return false;
      }

      logger.info(`✅ GHL credentials stored for dealer: ${dealerId}`);
      return true;
    } catch (err: any) {
      logger.error(`Failed to encrypt/store GHL credentials:`, err.message);
      return false;
    }
  }
}

// ============================================
// WEBHOOK SIGNATURE VALIDATION
// ============================================

export interface WebhookValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validate Tavus webhook signature
 *
 * Tavus signs webhooks with HMAC-SHA256:
 * signature = HMAC(timestamp.body, secret)
 */
export function validateTavusSignature(
  signature: string | undefined,
  timestamp: string | undefined,
  body: string
): WebhookValidationResult {
  const secret = process.env.TAVUS_WEBHOOK_SECRET;

  if (!secret) {
    logger.warn('⚠️ TAVUS_WEBHOOK_SECRET not configured - skipping validation');
    return { valid: true }; // Allow in dev if secret not set
  }

  if (!signature || !timestamp) {
    return { valid: false, error: 'Missing signature or timestamp' };
  }

  // Prevent replay attacks (reject webhooks older than 5 minutes)
  const timestampNum = parseInt(timestamp, 10);
  const now = Date.now();
  const fiveMinutes = 5 * 60 * 1000;

  if (isNaN(timestampNum) || Math.abs(now - timestampNum) > fiveMinutes) {
    return { valid: false, error: 'Webhook timestamp too old or invalid' };
  }

  // Compute expected signature
  const payload = `${timestamp}.${body}`;
  const expectedSignature = createHmac('sha256', secret)
    .update(payload)
    .digest('hex');

  // Timing-safe comparison
  const actualSig = signature.startsWith('sha256=')
    ? signature.slice(7)
    : signature;

  try {
    const isValid = timingSafeEqual(
      Buffer.from(actualSig),
      Buffer.from(expectedSignature)
    );
    return { valid: isValid, error: isValid ? undefined : 'Invalid signature' };
  } catch {
    return { valid: false, error: 'Signature comparison failed' };
  }
}

/**
 * Validate Retell webhook signature
 */
export function validateRetellSignature(
  signature: string | undefined,
  timestamp: string | undefined,
  body: string
): WebhookValidationResult {
  const secret = process.env.RETELL_WEBHOOK_SECRET;

  if (!secret) {
    logger.warn('⚠️ RETELL_WEBHOOK_SECRET not configured - skipping validation');
    return { valid: true };
  }

  if (!signature || !timestamp) {
    return { valid: false, error: 'Missing signature or timestamp' };
  }

  // Same replay attack prevention
  const timestampNum = parseInt(timestamp, 10);
  const now = Date.now();
  const fiveMinutes = 5 * 60 * 1000;

  if (isNaN(timestampNum) || Math.abs(now - timestampNum) > fiveMinutes) {
    return { valid: false, error: 'Webhook timestamp too old or invalid' };
  }

  const payload = `${timestamp}.${body}`;
  const expectedSignature = createHmac('sha256', secret)
    .update(payload)
    .digest('hex');

  const actualSig = signature.startsWith('sha256=')
    ? signature.slice(7)
    : signature;

  try {
    const isValid = timingSafeEqual(
      Buffer.from(actualSig),
      Buffer.from(expectedSignature)
    );
    return { valid: isValid, error: isValid ? undefined : 'Invalid signature' };
  } catch {
    return { valid: false, error: 'Signature comparison failed' };
  }
}
