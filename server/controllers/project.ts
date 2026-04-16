import { Request, Response } from 'express';
import { Types } from 'mongoose';
import Project, { IProject } from '../models/project';
import Language from '../models/languages';

const ALLOWED_QUERY_KEYS = ['name'] as const;
const ALLOWED_BODY_KEYS = [
  'name',
  'description',
  'shortDescription',
  'url',
  'githubUrl',
  'languages',
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
    if (typeof raw === 'string') clean[key] = raw;
  }
  return clean;
}

function pickBody(body: unknown): Partial<IProject> {
  if (!body || typeof body !== 'object') return {};
  const src = body as Record<string, unknown>;
  const out: Record<string, unknown> = {};
  for (const key of ALLOWED_BODY_KEYS) {
    if (key in src && src[key] !== undefined) out[key] = src[key];
  }
  return out as Partial<IProject>;
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

export const getProjects = async (req: Request, res: Response) => {
  const filter = sanitizeQuery(req.query);
  const projects = await Project.find(filter).populate('languages');
  return res.status(200).json(projects);
};

export const getProject = async (req: Request, res: Response) => {
  const id = getIdParam(req);
  if (!id) return res.status(400).json({ error: 'Invalid id format' });

  const project = await Project.findById(id).populate('languages');
  if (!project) return res.status(404).json({ error: 'Project not found' });
  return res.status(200).json(project);
};

export const createProject = async (req: Request, res: Response) => {
  const payload = pickBody(req.body);
  if (!payload.name || !payload.description || !payload.url || !payload.githubUrl) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const project = await Project.create(payload);

  const languageIds = extractObjectIds(payload.languages);
  if (languageIds.length > 0) {
    await Language.updateMany(
      { _id: { $in: languageIds } },
      { $addToSet: { projects: project._id } },
    );
  }

  return res.status(201).json(project);
};

export const updateProject = async (req: Request, res: Response) => {
  const id = getIdParam(req);
  if (!id) return res.status(400).json({ error: 'Invalid id format' });

  const existing = await Project.findById(id);
  if (!existing) return res.status(404).json({ error: 'Project not found' });

  const payload = pickBody(req.body);
  await Project.findByIdAndUpdate(id, payload, { runValidators: true });

  if (payload.languages !== undefined) {
    const oldIds = extractObjectIds(existing.languages);
    const newIds = extractObjectIds(payload.languages);

    const removed = oldIds.filter((oid) => !newIds.includes(oid));
    const added = newIds.filter((oid) => !oldIds.includes(oid));

    if (removed.length > 0) {
      await Language.updateMany(
        { _id: { $in: removed } },
        { $pull: { projects: existing._id } },
      );
    }
    if (added.length > 0) {
      await Language.updateMany(
        { _id: { $in: added } },
        { $addToSet: { projects: existing._id } },
      );
    }
  }

  return res.status(204).end();
};

export const deleteProject = async (req: Request, res: Response) => {
  const id = getIdParam(req);
  if (!id) return res.status(400).json({ error: 'Invalid id format' });

  await Language.updateMany({ projects: id }, { $pull: { projects: id } });

  const deleted = await Project.findByIdAndDelete(id);
  if (!deleted) return res.status(404).json({ error: 'Project not found' });

  return res.status(204).end();
};
