import { Router, Request, Response } from 'express';
import { supabase } from '../../lib/supabase';

const router = Router();

// POST /api/analytics/ingest
// Unified ingestion endpoint for Retell & Tavus data
router.post('/ingest', async (req: Request, res: Response) => {
  try {
    const { 
      source, // 'retell' | 'tavus'
      call_id,
      conversation_id, // Tavus uses conversation_id
      data,
      contact_info // { name, phone, email, ... }
    } = req.body;

    console.log(`📊 Analytics Ingest [${source}]:`, call_id || conversation_id);

    if (source === 'retell') {
      // Ingest Retell Voice Analytics
      const { summary, sentiment, transcript, user_sentiment, call_analysis, retell_llm_dynamic_variables } = data;
      
      // Determine customer name from contact_info OR dynamic vars
      const customer_name = contact_info?.name || retell_llm_dynamic_variables?.customer_name || 'Unknown';

      // Update call_logs
      const { error } = await supabase
        .from('call_logs')
        .upsert({
          call_id,
          customer_name,
          user_phone: contact_info?.phone || null, // Priority to direct contact info
          summary,
          sentiment: user_sentiment || sentiment, // normalization
          transcript,
          analytics: call_analysis,
          variables: retell_llm_dynamic_variables,
          status: 'completed',
          end_time: new Date().toISOString()
        }, { onConflict: 'call_id' });

      if (error) throw error;

    } else if (source === 'tavus') {
      // Ingest Tavus Video Perception
      const perception = data.perception_analysis || data;
      
      const { 
        user_appearance, 
        setting, 
        gaze_expressions, 
        behavioral_gestures, 
        emotional_state 
      } = perception;

      // Insert into perception_analytics
      const { error } = await supabase
        .from('perception_analytics')
        .insert({
          conversation_id,
          customer_name: contact_info?.name || 'Unknown User',
          contact_info: contact_info || {},
          user_appearance,
          setting,
          gaze_expressions,
          behavioral_gestures,
          emotional_state
        });

      if (error) throw error;
    } else {
      return res.status(400).json({ success: false, error: 'Invalid source' });
    }

    res.json({ success: true, message: 'Data ingested successfully' });

  } catch (error: any) {
    console.error('❌ Analytics Ingest Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
