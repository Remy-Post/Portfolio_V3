import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import {
  getLanguages,
  getLanguage,
  createLanguage,
  updateLanguage,
  deleteLanguage,
} from './controllers/languages';
import {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
} from './controllers/project';

const app: Application = express();

const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN ?? 'http://localhost:3000';
app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }));
app.use(express.json({ limit: '100kb' }));

// Health probe
app.get('/healthz', (_req, res) => res.status(200).json({ ok: true }));

// Languages
app.get('/api/v1/languages', getLanguages);
app.get('/api/v1/languages/:id', getLanguage);
app.post('/api/v1/languages', createLanguage);
app.put('/api/v1/languages/:id', updateLanguage);
app.delete('/api/v1/languages/:id', deleteLanguage);

// Projects
app.get('/api/v1/projects', getProjects);
app.get('/api/v1/projects/:id', getProject);
app.post('/api/v1/projects', createProject);
app.put('/api/v1/projects/:id', updateProject);
app.delete('/api/v1/projects/:id', deleteProject);

// 404
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Not Found' });
});

// Centralized error handler
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  const e = err as { name?: string; message?: string; errors?: unknown };

  if (e?.name === 'CastError') {
    return res.status(400).json({ error: 'Invalid id format' });
  }
  if (e?.name === 'ValidationError') {
    return res.status(400).json({ error: 'Validation failed', details: e.errors });
  }

  console.error('Unhandled error:', e?.message ?? err);
  return res.status(500).json({ error: 'Internal Server Error' });
});

const dbUri = process.env.DB;
if (!dbUri) {
  console.error('DB env var is not set. Aborting.');
  process.exit(1);
}

mongoose
  .connect(dbUri)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err: Error) => {
    console.error(`MongoDB connection failed: ${err.message}`);
    process.exit(1);
  });

const PORT = Number.parseInt(process.env.SERVER_PORT ?? '4000', 10);

app
  .listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  })
  .on('error', (err: Error) => {
    console.error(`Server error: ${err.message}`);
    process.exit(1);
  });
