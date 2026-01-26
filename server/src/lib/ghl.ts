import axios, { AxiosInstance } from 'axios';

interface GHLContact {
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
  customFields?: Record<string, any>;
  tags?: string[];
}

export class GHLService {
  private client: AxiosInstance;
  private locationId: string;

  constructor() {
    const token = process.env.GHL_ACCESS_TOKEN;
    this.locationId = process.env.GHL_LOCATION_ID || '';

    if (!token) {
      console.error("⚠️ GHL_ACCESS_TOKEN is missing. GHL sync will fail.");
    }

    this.client = axios.create({
      baseURL: 'https://services.leadconnectorhq.com',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Version': '2021-07-28',
        'Content-Type': 'application/json'
      }
    });
  }

  /**
   * Find a contact by Email or Phone. 
   * Returns the first match or null.
   */
  async findContact(query: string): Promise<GHLContact | null> {
    try {
      const resp = await this.client.get(`/contacts/`, {
        params: {
          locationId: this.locationId,
          query: query,
          limit: 1
        }
      });
      return resp.data.contacts?.[0] || null;
    } catch (error: any) {
      console.error(`❌ GHL findContact Error:`, error.response?.data || error.message);
      return null;
    }
  }

  /**
   * Create or Update a contact.
   */
  async createOrUpdateContact(data: GHLContact): Promise<GHLContact | null> {
    try {
      // 1. Try to find existing first
      const existing = await this.findContact(data.email || data.phone || '');
      
      if (existing && existing.id) {
        // Update
        const resp = await this.client.put(`/contacts/${existing.id}`, {
          ...data,
          locationId: this.locationId // Required payload sometimes
        });
        return resp.data.contact;
      } else {
        // Create
        const resp = await this.client.post(`/contacts/`, {
          ...data,
          locationId: this.locationId
        });
        return resp.data.contact;
      }
    } catch (error: any) {
      console.error(`❌ GHL createOrUpdateContact Error:`, error.response?.data || error.message);
      return null;
    }
  }

  /**
   * Add a Note to a Contact
   */
  async addNote(contactId: string, content: string) {
    try {
      await this.client.post(`/contacts/${contactId}/notes`, {
        body: content,
        userId: null // System note
      });
    } catch (error: any) {
      console.error(`❌ GHL addNote Error:`, error.message);
    }
  }

  /**
   * Create/Update Opportunity (Pipeline Stage)
   */
  async updatePipelineStage(contactId: string, pipelineId: string, stageId: string, status: 'open' | 'won' | 'lost' | 'abandoned' = 'open') {
    try {
      // We need to upsert. GHL doesn't have a clean "Upsert Opportunity" by Contact ID easily.
      // We usually fetch opportunities for this contact first.
      // For simplicity in this V-Suite, we will just CREATE a new one if it's a major event, 
      // or try to match logic. 
      // Actually, GHL API allows creating an opportunity. If one exists in the pipeline, it might duplicate?
      // Let's assume we create a new one for "VIP Buyback" context.
      
      await this.client.post(`/opportunities/`, {
        pipelineId,
        locationId: this.locationId,
        contactId,
        stageId,
        status,
        name: "VIP Buyback Lead" 
      });
    } catch (error: any) {
      console.error(`❌ GHL updatePipelineStage Error:`, error.response?.data || error.message);
    }
  }
  /**
   * Send SMS via GHL Conversations API
   */
  async sendSMS(contactId: string, message: string) {
    try {
      // GHL V2 Conversation API
      // First, get or create conversation
      // Actually, GHL V2 has /conversations/messages endpoint that takes contactId directly? 
      // Documentation says: POST /conversations/messages
      // Body: { contactId, type: "SMS", messageBody: "..." }
      
      const resp = await this.client.post('/conversations/messages', {
        type: "SMS",
        contactId,
        messageBody: message
        // providerType: "LeadConnector" (optional, defaults to default provider)
      });
      
      console.log(`✅ SMS Sent to ${contactId}: "${message.substring(0, 20)}..."`);
      return resp.data;
    } catch (error: any) {
      console.error(`❌ GHL sendSMS Error:`, error.response?.data || error.message);
      // Fallback: If 400, maybe missing conversation? V2 usually handles this.
      throw error;
    }
  }
}

export const ghl = new GHLService();
