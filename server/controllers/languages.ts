import express, { Request, Response } from 'express';
import Language from '../models/languages';

/**
 * @swagger
 * /api/v1/languages:
 *   get:
 *     summary: Retrieve all languages
 *     responses:
 *       200:
 *         description: A list of games
 */
export const getLanguages = async (req: Request, res: Response) => {
    // use req.query property to check for any url search filter.  returns keys/vals after ? 
    const filter = req.query;

    // use model to query mongodb for game docs.  find() gets all docs, adding optional filter
    const languages = await Language.find(filter);

    if (!languages || languages.length === 0) {
        return res.status(404).json({ message: 'No languages found' });
    }

    return res.status(200).json(languages);
};  

export const getLanguage = async(req: Request, res: Response) => {
    // try to fetch selected language by its id from url param
    const language = await Language.findById(req.params.id);    

    // err handle
    if (!language) { return res.status(404).json({ message: 'Language Not Found' }) }

    // return selected language
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
        return res.status(400).json({ 'err': 'Invalid Request Body' }); // 400: Bad Request
    }

    // add new language to db from request body via Language model
    await Language.create(req.body);

    return res.status(201).json(); // 201: resource created
};

/**
 * @swagger
 * /api/v1/games/{id}:
 *  put:
 *    summary: Update a game by id
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: integer
 *        required: true
 *        description: Numeric id of the game to update
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              id:
 *                type: integer
 *              title:
 *                type: string
 *    responses:
 *      204:
 *        description: Language updated successfully
 *      400:
 *        description: Id missing - Bad Requests
 */
export const updateLanguage = async (req: Request, res: Response) => {
    // validate we have an id value
    if (!req.params.id) {
        return res.status(400).json({ 'error': 'Bad Request - Id parameter missing' });
    }

    await Language.findByIdAndUpdate(req.params.id, req.body);
    return res.status(204).json({ 'msg': 'Language Updated' }); // 204: No Content
};

/**
 * @swagger
 * /api/v1/games/{id}:
 *  delete:
 *    summary: Remove a game by id
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: integer
 *        required: true
 *        description: Numeric id of the game to delete
 *    responses:
 *      204:
 *        description: Language deleted successfully
 *      400:
 *        description: Id Missing - Bad Request
 */
export const deleteLanguage = async (req: Request, res: Response) => {
     // validate we have an id value
    if (!req.params.id) {
        return res.status(400).json({ 'error': 'Bad Request - Id parameter missing' });
    }

    await Language.findByIdAndDelete(req.params.id);
     return res.status(204).json({ 'msg': 'Language Deleted' }); // 204: No Content
};
