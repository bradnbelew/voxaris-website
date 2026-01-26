import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import voiceRoutes from './modules/voice/voice.controller';
import retellLLMRoutes from './modules/voice/retell-llm.controller';
import analyticsRoutes from './modules/analytics/analytics.controller';
import webhookRoutes from './modules/webhooks/webhook.controller';
import landingRoutes from './modules/landing/landing.controller';
import dashboardRoutes from './modules/analytics/dashboard.controller';

// Load env vars
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/voice', voiceRoutes);
app.use('/api', retellLLMRoutes); // Retell Custom LLM at /api/retell-llm
app.use('/api/analytics', analyticsRoutes); // V-Suite Analytics at /api/analytics/ingest
app.use('/api/webhooks', webhookRoutes); // New Unified Webhooks
app.use('/api/landing', landingRoutes);   // QR Scan API
app.use('/api/analytics', dashboardRoutes); // V-Suite Dashboard API

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
