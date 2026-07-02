import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import path from 'path';
import fs from 'fs';
import { config } from './config';
import { seedDatabase } from './utils/seed';

import authRoutes from './routes/auth';
import resumeRoutes from './routes/resumes';
import jobRoutes from './routes/jobs';
import matchRoutes from './routes/matches';
import reportRoutes from './routes/reports';
import savedJobRoutes from './routes/savedJobs';
import notificationRoutes from './routes/notifications';
import progressRoutes from './routes/progress';
import resourceRoutes from './routes/resources';
import analyticsRoutes from './routes/analytics';

const app = express();

if (!fs.existsSync(config.storage.uploadDir)) {
  fs.mkdirSync(config.storage.uploadDir, { recursive: true });
}

app.use(helmet());
app.use(cors({ origin: config.cors.origin, credentials: true }));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  message: { error: 'Too many requests, please try again later.' },
});
app.use('/api/', limiter);

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/saved-jobs', savedJobRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/analytics', analyticsRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api', (_req, res) => {
  res.json({ name: 'SkillBridge AI API', version: '1.0.0', endpoints: [
    '/api/auth', '/api/resumes', '/api/jobs', '/api/matches',
    '/api/reports', '/api/saved-jobs', '/api/notifications',
    '/api/progress', '/api/resources', '/api/analytics', '/api/health',
  ]});
});

seedDatabase();

app.listen(config.port, () => {
  console.log(`SkillBridge AI API server running on http://localhost:${config.port}`);
});

export default app;
