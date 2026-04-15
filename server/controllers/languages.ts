import { Request, Response } from 'express';
import Language from '../models/languages';
import Project from '../models/project';

/**
 * @swagger
 * /api/v1/languages:
 *   get:
 *     summary: Retrieve all languages
 *     responses:
 *       200:
 *         description: A list of languages
 */
export const getLanguages = async (req: Request, res: Response) => {
    const filter = req.query;
    const languages = await Language.find(filter).populate('projects');

    if (!languages || languages.length === 0) {
        return res.status(404).json({ message: 'No languages found' });
    }

    return res.status(200).json(languages);
};

export const getLanguage = async(req: Request, res: Response) => {
    const language = await Language.findById(req.params.id).populate('projects');

    if (!language) { return res.status(404).json({ message: 'Language Not Found' }) }

    return res.status(200).json(language);
};

/**
 * @swagger
 * /api/v1/languages:
 *   post:
 *     summary: Create a new language
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
 *         description: Language created
 *       400:
 *         description: Bad request
 */
export const createLanguage = async (req: Request, res: Response) => {
    if (!req.body) {
        return res.status(400).json({ 'err': 'Invalid Request Body' });
    }

    const language = await Language.create(req.body);

    // Sync: add this language to each referenced project's languages array
    if (language.projects && language.projects.length > 0) {
        await Project.updateMany(
            { _id: { $in: language.projects } } as any,
            { $addToSet: { languages: language._id } } as any
        );
    }

    return res.status(201).json();
};

/**
 * @swagger
 * /api/v1/languages/{id}:
 *  put:
 *    summary: Update a language by id
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: Language id to update
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
 *              icon:
 *                type: string
 *    responses:
 *      204:
 *        description: Language updated successfully
 *      400:
 *        description: Id missing - Bad Requests
 */
export const updateLanguage = async (req: Request, res: Response) => {
    if (!req.params.id) {
        return res.status(400).json({ 'error': 'Bad Request - Id parameter missing' });
    }

    const oldLanguage = await Language.findById(req.params.id);
    if (!oldLanguage) {
        return res.status(404).json({ message: 'Language Not Found' });
    }

    await Language.findByIdAndUpdate(req.params.id, req.body);

    // Sync projects if the projects array changed
    if (req.body.projects) {
        const oldProjectIds = (oldLanguage.projects || []).map((id: any) => id.toString());
        const newProjectIds = (req.body.projects || []).map((id: any) => id.toString());

        const removed = oldProjectIds.filter((id: string) => !newProjectIds.includes(id));
        if (removed.length > 0) {
            await Project.updateMany(
                { _id: { $in: removed } } as any,
                { $pull: { languages: oldLanguage._id } } as any
            );
        }

        const added = newProjectIds.filter((id: string) => !oldProjectIds.includes(id));
        if (added.length > 0) {
            await Project.updateMany(
                { _id: { $in: added } } as any,
                { $addToSet: { languages: oldLanguage._id } } as any
            );
        }
    }

    return res.status(204).json({ 'msg': 'Language Updated' });
};

/**
 * @swagger
 * /api/v1/languages/{id}:
 *  delete:
 *    summary: Remove a language by id
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: Language id to delete
 *    responses:
 *      204:
 *        description: Language deleted successfully
 *      400:
 *        description: Id Missing - Bad Request
 */
export const deleteLanguage = async (req: Request, res: Response) => {
    if (!req.params.id) {
        return res.status(400).json({ 'error': 'Bad Request - Id parameter missing' });
    }

    // Remove this language from all projects that reference it
    await Project.updateMany(
        { languages: req.params.id } as any,
        { $pull: { languages: req.params.id } } as any
    );

    await Language.findByIdAndDelete(req.params.id);
    return res.status(204).json({ 'msg': 'Language Deleted' });
};
