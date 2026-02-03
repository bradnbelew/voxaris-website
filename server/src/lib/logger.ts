
import winston from 'winston';
import LokiTransport from 'winston-loki';
import dotenv from 'dotenv';
import path from 'path';

// Load envs if not already loaded
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const { combine, timestamp, json, colorize, printf } = winston.format;

const GRAFANA_HOST = process.env.GRAFANA_LOKI_HOST; // e.g. https://logs-prod-us-central1.grafana.net
const GRAFANA_USER = process.env.GRAFANA_LOKI_USER; // e.g. 123456
const GRAFANA_PASS = process.env.GRAFANA_LOKI_PASSWORD; // API Key

const transports: any[] = [
  new winston.transports.Console({
    format: winston.format.combine(
      colorize(),
      printf(({ timestamp, level, message, ...meta }) => {
        return `${timestamp} [${level}]: ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ''}`;
      })
    ),
  }),
];

// Only add Grafana transport if credentials exist
if (GRAFANA_HOST && GRAFANA_USER && GRAFANA_PASS) {
  transports.push(
    new LokiTransport({
      host: GRAFANA_HOST,
      basicAuth: `${GRAFANA_USER}:${GRAFANA_PASS}`,
      json: true,
      labels: { app: 'voxaris-backend', env: process.env.NODE_ENV || 'development' },
      format: json(),
      replaceTimestamp: true,
      onConnectionError: (err) => console.error('❌ Grafana Loki Error:', err)
    })
  );
  console.log("✅ Grafana Loki Logging Enabled");
} else {
  console.log("⚠️ Grafana Credentials missing. Logging to Console only.");
}

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    timestamp(),
    json()
  ),
  transports,
});
