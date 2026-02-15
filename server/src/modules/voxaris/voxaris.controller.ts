/**
 * Voxaris Demo Controller
 *
 * Main API for the Voxaris marketing demo page.
 * Handles outbound call triggers, web calls, and config.
 */

import { Router, Request, Response } from 'express';
import Retell from 'retell-sdk';
import { retell } from '../../lib/retell';
import { logger } from '../../lib/logger';
import rateLimit from 'express-rate-limit';

const router = Router();

// Rate limit: 3 outbound calls per minute per IP
const outboundCallLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 3,
  message: { success: false, error: 'Too many call requests. Please wait a minute.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Retell SDK for web calls (needs the SDK, not our wrapper)
const retellSdk = new Retell({
  apiKey: process.env.RETELL_API_KEY || '',
});

// Config
const VOXARIS_OUTBOUND_AGENT_ID = process.env.VOXARIS_OUTBOUND_AGENT_ID;
const VOXARIS_INBOUND_AGENT_ID = process.env.VOXARIS_INBOUND_AGENT_ID;
const VOXARIS_OUTBOUND_NUMBER = process.env.VOXARIS_OUTBOUND_NUMBER;
const VOXARIS_INBOUND_NUMBER = process.env.VOXARIS_INBOUND_NUMBER;

/**
 * POST /api/voxaris/outbound-call
 *
 * Triggered by the Demo page "Call Me Now" form.
 * Maria calls the user's phone immediately.
 */
router.post('/outbound-call', outboundCallLimiter, async (req: Request, res: Response) => {
  try {
    const { firstName, phone, company } = req.body;

    // Validate required fields
    if (!firstName || !phone) {
      return res.status(400).json({
        success: false,
        error: 'First name and phone number are required',
      });
    }

    if (!VOXARIS_OUTBOUND_AGENT_ID) {
      logger.error('VOXARIS_OUTBOUND_AGENT_ID not configured');
      return res.status(500).json({
        success: false,
        error: 'Outbound agent not configured',
      });
    }

    if (!VOXARIS_OUTBOUND_NUMBER) {
      logger.error('VOXARIS_OUTBOUND_NUMBER not configured');
      return res.status(500).json({
        success: false,
        error: 'Outbound number not configured',
      });
    }

    // Normalize phone to E.164
    const normalizedPhone = normalizePhone(phone);

    logger.info(`📞 Voxaris outbound call: ${firstName} (${company || 'N/A'}) → ${normalizedPhone}`);

    const callResult = await retell.createOutboundCall({
      fromNumber: VOXARIS_OUTBOUND_NUMBER,
      toNumber: normalizedPhone,
      agentId: VOXARIS_OUTBOUND_AGENT_ID,
      dynamicVariables: {
        customer_name: firstName,
        company_name: company || '',
        intro_context: 'calling because you just requested a demo on our website',
      },
      metadata: {
        source: 'voxaris-demo',
        type: 'outbound',
        company: company || '',
      },
    });

    if (callResult.success) {
      logger.info(`✅ Voxaris outbound call initiated: ${callResult.callId}`);
      return res.json({
        success: true,
        call_id: callResult.callId,
      });
    }

    logger.error(`❌ Voxaris outbound call failed: ${callResult.error}`);
    return res.status(500).json({
      success: false,
      error: callResult.error || 'Failed to initiate call',
    });

  } catch (error: any) {
    logger.error(`❌ Voxaris outbound-call error: ${error.message}`);
    return res.status(500).json({
      success: false,
      error: 'Failed to initiate call',
    });
  }
});

/**
 * POST /api/voxaris/web-call
 *
 * Creates a browser-based voice call via Retell Web SDK.
 * Returns access_token for the frontend to connect.
 */
router.post('/web-call', async (req: Request, res: Response) => {
  try {
    const agentId = VOXARIS_INBOUND_AGENT_ID;

    if (!agentId) {
      return res.status(500).json({
        success: false,
        error: 'Voice agent not configured',
      });
    }

    if (!process.env.RETELL_API_KEY) {
      return res.status(500).json({
        success: false,
        error: 'Retell not configured',
      });
    }

    logger.info(`🎙️ Creating Voxaris web call`);

    const webCall = await retellSdk.call.createWebCall({
      agent_id: agentId,
      metadata: {
        source: 'voxaris-demo',
        type: 'web-call',
      },
    });

    logger.info(`✅ Voxaris web call created: ${webCall.call_id}`);

    return res.json({
      success: true,
      call_id: webCall.call_id,
      access_token: webCall.access_token,
    });

  } catch (error: any) {
    logger.error(`❌ Voxaris web-call error: ${error.message}`);
    return res.status(500).json({
      success: false,
      error: 'Failed to create web call',
    });
  }
});

/**
 * GET /api/voxaris/config
 *
 * Returns non-secret configuration for the frontend.
 */
router.get('/config', (req: Request, res: Response) => {
  res.json({
    inboundNumber: VOXARIS_INBOUND_NUMBER || '',
    hasOutboundAgent: !!VOXARIS_OUTBOUND_AGENT_ID,
    hasVideoAgent: !!process.env.VOXARIS_TAVUS_PERSONA_ID,
  });
});

/**
 * GET /api/voxaris/health
 */
router.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    module: 'voxaris',
    agents: {
      outbound: !!VOXARIS_OUTBOUND_AGENT_ID,
      inbound: !!VOXARIS_INBOUND_AGENT_ID,
      video: !!process.env.VOXARIS_TAVUS_PERSONA_ID,
    },
  });
});

// ============================================================================
// HELPERS
// ============================================================================

function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`;
  if (phone.startsWith('+')) return phone;
  return `+${digits}`;
}

export default router;
