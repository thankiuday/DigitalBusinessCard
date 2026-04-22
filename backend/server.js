import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { connectDB } from './src/config/db.js';
import { config } from './src/config/env.js';
import { errorHandler } from './src/middleware/errorHandler.js';
import { generalLimiter } from './src/middleware/rateLimiter.js';

import authRoutes from './src/routes/auth.routes.js';
import cardRoutes from './src/routes/card.routes.js';
import uploadRoutes from './src/routes/upload.routes.js';
import publicRoutes from './src/routes/public.routes.js';
import analyticsRoutes from './src/routes/analytics.routes.js';

const app = express();
const localOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173'];
const configuredOrigins = (config.clientUrl || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);
const allowedOrigins = new Set([...localOrigins, ...configuredOrigins]);

// Security & Performance
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(compression());
app.use(cors({
  origin: (origin, cb) => {
    // Allow non-browser requests and same-origin server calls.
    if (!origin) return cb(null, true);
    if (allowedOrigins.has(origin)) return cb(null, true);
    return cb(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(generalLimiter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/cards', cardRoutes);
app.use('/api/v1/upload', uploadRoutes);
app.use('/api/v1/public', publicRoutes);
app.use('/api/v1/analytics', analyticsRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handler
app.use(errorHandler);

const start = async () => {
  await connectDB();
  const server = app.listen(config.port, () => {
    console.log(`Phygital API running on port ${config.port} [${config.nodeEnv}]`);
  });
  // Longer limits help multipart → Cloudinary uploads behind Vite proxy (avoids premature ECONNRESET)
  server.keepAliveTimeout = 75000;
  server.headersTimeout = 300000;
  server.requestTimeout = 300000;
};

start();
