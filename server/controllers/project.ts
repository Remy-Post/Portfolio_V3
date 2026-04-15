import { Request, Response } from 'express';
import Project from '../models/project';
import Language from '../models/languages';

/**
 * @swagger
 * /api/v1/projects:
 *   get:
 *     summary: Retrieve all projects
 *     responses:
 *       200:
 *         description: A list of projects
 */
export const getProjects = async (req: Request, res: Response) => {
    const filter = req.query;
    const projects = await Project.find(filter).populate('languages');

    if (!projects || projects.length === 0) {
        return res.status(404).json({ message: 'No projects found' });
    }

    return res.status(200).json(projects);
};

export const getProject = async(req: Request, res: Response) => {
    const project = await Project.findById(req.params.id).populate('languages');

    if (!project) { return res.status(404).json({ message: 'Project Not Found' }) }

    return res.status(200).json(project);
};

/**
 * @swagger
 * /api/v1/projects:
 *   post:
 *     summary: Create a new project
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               color:
 *                 type: string
 *     responses:
 *       201:
 *         description: Project created
 *       400:
 *         description: Bad request
 */
export const createProject = async (req: Request, res: Response) => {
    if (!req.body) {
        return res.status(400).json({ 'err': 'Invalid Request Body' });
    }

    const project = await Project.create(req.body);

    // Sync: add this project to each referenced language's projects array
    if (project.languages && project.languages.length > 0) {
        await Language.updateMany(
            { _id: { $in: project.languages } } as any,
            { $addToSet: { projects: project._id } } as any
        );
    }

    return res.status(201).json();
};

/**
 * @swagger
 * /api/v1/projects/{id}:
 *  put:
 *    summary: Update a project by id
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: Project id to update
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *              color:
 *                type: string
 *    responses:
 *      204:
 *        description: Project updated successfully
 *      400:
 *        description: Id missing - Bad Requests
 */
export const updateProject = async (req: Request, res: Response) => {
    if (!req.params.id) {
        return res.status(400).json({ 'error': 'Bad Request - Id parameter missing' });
    }

    const oldProject = await Project.findById(req.params.id);
    if (!oldProject) {
        return res.status(404).json({ message: 'Project Not Found' });
    }

    await Project.findByIdAndUpdate(req.params.id, req.body);

    // Sync languages if the languages array changed
    if (req.body.languages) {
        const oldLanguageIds = (oldProject.languages || []).map((id: any) => id.toString());
        const newLanguageIds = (req.body.languages || []).map((id: any) => id.toString());

        const removed = oldLanguageIds.filter((id: string) => !newLanguageIds.includes(id));
        if (removed.length > 0) {
            await Language.updateMany(
                { _id: { $in: removed } } as any,
                { $pull: { projects: oldProject._id } } as any
            );
        }

        const added = newLanguageIds.filter((id: string) => !oldLanguageIds.includes(id));
        if (added.length > 0) {
            await Language.updateMany(
                { _id: { $in: added } } as any,
                { $addToSet: { projects: oldProject._id } } as any
            );
        }
    }

    return res.status(204).json({ 'msg': 'Project Updated' });
};

/**
 * @swagger
 * /api/v1/projects/{id}:
 *  delete:
 *    summary: Remove a project by id
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: Project id to delete
 *    responses:
 *      204:
 *        description: Project deleted successfully
 *      400:
 *        description: Id Missing - Bad Request
 */
export const deleteProject = async (req: Request, res: Response) => {
    if (!req.params.id) {
        return res.status(400).json({ 'error': 'Bad Request - Id parameter missing' });
    }

    // Remove this project from all languages that reference it
    await Language.updateMany(
        { projects: req.params.id } as any,
        { $pull: { projects: req.params.id } } as any
    );

    await Project.findByIdAndDelete(req.params.id);
    return res.status(204).json({ 'msg': 'Project Deleted' });
};
