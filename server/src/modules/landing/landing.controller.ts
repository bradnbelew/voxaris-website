import { Router, Request, Response } from 'express';
import { ghl } from '../../lib/ghl';

const router = Router();

// ==========================================
// LANDING PAGE API (QR Scan)
// ==========================================
// Endpoint: POST /api/landing/qr-scan
// Payload: { first_name, phone, ... vehicle info ... }
// Returns: { redirect_url: "https://tavus.io/..." }

router.post('/qr-scan', async (req: Request, res: Response) => {
    try {
        const { 
            first_name, 
            last_name, 
            phone, 
            email, 
            vehicle_year, 
            vehicle_make, 
            vehicle_model,
            campaign_id 
        } = req.body;

        if (!phone || !first_name) {
             return res.status(400).json({ error: "Missing required fields (phone, first_name)" });
        }

        console.log(`📷 QR Scan Processed: ${first_name} (${phone})`);

        // 1. Create/Update Contact in GHL
        const contact = await ghl.createOrUpdateContact({
            name: `${first_name} ${last_name || ''}`.trim(),
            phone,
            email,
            tags: ["QR_SCANNED", "VIP_BUYBACK_LEAD"],
            customFields: {
                // Map to our Blueprint Fields
                vehicle_year,
                vehicle_make,
                vehicle_model,
                campaign_id,
                qr_scanned: "Yes",
                qr_scan_date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
                source: "QR Scan"
            }
        });

        // 2. Generate Redirect URL (Tavus Session)
        // Ideally we call Tavus API here to generate a fresh session.
        // For Prototype V1, we might use a static Tavus Link or the Lovable Video Page.
        // User architecture says: "Lovable Landing Page" -> "Talk to Maria".
        // The frontend handles the Tavus embed.
        // So we just return success.
        
        res.json({ 
            success: true, 
            contact_id: contact?.id,
            // Logic: Retell is eager to call? Or we wait for user to click button?
            // Architecture says user clicks "Talk to Maria".
        });

    } catch (error: any) {
        console.error("❌ QR Scan API Error:", error);
        res.status(500).json({ error: error.message });
    }
});

export default router;
