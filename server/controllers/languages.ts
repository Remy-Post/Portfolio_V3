import { Request, Response } from 'express';
import { Types } from 'mongoose';
import Language, { ILanguage } from '../models/languages';
import Project from '../models/project';

const ALLOWED_QUERY_KEYS = ['name', 'proficiency'] as const;
const ALLOWED_BODY_KEYS = [
  'name',
  'colour',
  'icon',
  'proficiency',
  'description',
  'similarLanguages',
  'projects',
] as const;

type MongoFilter = Record<string, unknown>;

function getIdParam(req: Request): string | null {
  const raw = req.params.id;
  const id = Array.isArray(raw) ? raw[0] : raw;
  if (!id || !Types.ObjectId.isValid(id)) return null;
  return id;
}

function sanitizeQuery(query: Request['query']): MongoFilter {
  const clean: MongoFilter = {};
  for (const key of ALLOWED_QUERY_KEYS) {
    const raw = query[key];
    if (typeof raw !== 'string') continue;
    if (key === 'proficiency') {
      const n = Number.parseInt(raw, 10);
      if (!Number.isNaN(n)) clean.proficiency = n;
    } else {
      clean.name = raw;
    }
  }
  return clean;
}

function pickBody(body: unknown): Partial<ILanguage> {
  if (!body || typeof body !== 'object') return {};
  const src = body as Record<string, unknown>;
  const out: Record<string, unknown> = {};
  for (const key of ALLOWED_BODY_KEYS) {
    if (key in src && src[key] !== undefined) out[key] = src[key];
  }
  return out as Partial<ILanguage>;
}

function extractObjectIds(input: unknown): string[] {
  if (!Array.isArray(input)) return [];
  const ids: string[] = [];
  for (const raw of input) {
    if (raw instanceof Types.ObjectId) ids.push(raw.toString());
    else if (typeof raw === 'string' && Types.ObjectId.isValid(raw)) ids.push(raw);
    else if (raw && typeof raw === 'object' && '_id' in raw) {
      const id = (raw as { _id: unknown })._id;
      if (typeof id === 'string') ids.push(id);
      else if (id instanceof Types.ObjectId) ids.push(id.toString());
    }
  }
  return ids;
}

export const getLanguages = async (req: Request, res: Response) => {
  const filter = sanitizeQuery(req.query);
  const languages = await Language.find(filter).populate('projects');
  return res.status(200).json(languages);
};

export const getLanguage = async (req: Request, res: Response) => {
  const id = getIdParam(req);
  if (!id) return res.status(400).json({ error: 'Invalid id format' });

  const language = await Language.findById(id).populate('projects');
  if (!language) return res.status(404).json({ error: 'Language not found' });
  return res.status(200).json(language);
};

export const createLanguage = async (req: Request, res: Response) => {
  const payload = pickBody(req.body);
  if (!payload.name || !payload.colour || !payload.icon) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const language = await Language.create(payload);

  const projectIds = extractObjectIds(payload.projects);
  if (projectIds.length > 0) {
    await Project.updateMany(
      { _id: { $in: projectIds } },
      { $addToSet: { languages: language._id } },
    );
  }

  return res.status(201).json(language);
};

export const updateLanguage = async (req: Request, res: Response) => {
  const id = getIdParam(req);
  if (!id) return res.status(400).json({ error: 'Invalid id format' });

  const existing = await Language.findById(id);
  if (!existing) return res.status(404).json({ error: 'Language not found' });

  const payload = pickBody(req.body);
  await Language.findByIdAndUpdate(id, payload, { runValidators: true });

  if (payload.projects !== undefined) {
    const oldIds = extractObjectIds(existing.projects);
    const newIds = extractObjectIds(payload.projects);

    const removed = oldIds.filter((oid) => !newIds.includes(oid));
    const added = newIds.filter((oid) => !oldIds.includes(oid));

    if (removed.length > 0) {
      await Project.updateMany(
        { _id: { $in: removed } },
        { $pull: { languages: existing._id } },
      );
    }
    if (added.length > 0) {
      await Project.updateMany(
        { _id: { $in: added } },
        { $addToSet: { languages: existing._id } },
      );
    }
  }

  return res.status(204).end();
};

export const deleteLanguage = async (req: Request, res: Response) => {
  const id = getIdParam(req);
  if (!id) return res.status(400).json({ error: 'Invalid id format' });

  await Project.updateMany({ languages: id }, { $pull: { languages: id } });

  const deleted = await Language.findByIdAndDelete(id);
  if (!deleted) return res.status(404).json({ error: 'Language not found' });

  return res.status(204).end();
};
