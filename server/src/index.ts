import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import voiceRoutes from './modules/voice/voice.controller';
import retellLLMRoutes from './modules/voice/retell-llm.controller';
import analyticsRoutes from './modules/analytics/analytics.controller';

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

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
