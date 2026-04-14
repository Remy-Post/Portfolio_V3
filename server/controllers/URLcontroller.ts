import express, { Request, Response } from 'express';
import URL from '../models/URL';

/**
 * @swagger
 * /api/v1/URLs:
 *   get:
 *     summary: Retrieve all URLs
 *     responses:
 *       200:
 *         description: A list of games
 */
export const getURLs = async (req: Request, res: Response) => {
    // use req.query property to check for any url search filter.  returns keys/vals after ? 
    const filter = req.query;

    // use model to query mongodb for game docs.  find() gets all docs, adding optional filter
    const URLs = await URL.find(filter);

    if (!URLs || URLs.length === 0) {
        return res.status(404).json({ message: 'No URLs found' });
    }

    return res.status(200).json(URLs);
};

export const getURL = async(req: Request, res: Response) => {
    // try to fetch selected URL by its id from url param
    const url = await URL.findById(req.params.id);

    // err handle
    if (!url) { return res.status(404).json({ message: 'URL Not Found' }) }

    // return selected URL
    return res.status(200).json(url);
};

/**
 * @swagger
 * /api/v1/games:
 *   post:
 *     summary: Create a new game
 *     requestBody: 
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               title:
 *                 type: string
 *     responses:
 *       201:
 *         description: Game created
 *       400:
 *         description: Bad request
 */
export const createURL = async (req: Request, res: Response) => {
    if (!req.body) {
        return res.status(400).json({ 'err': 'Invalid Request Body' }); // 400: Bad Request
    }

    // add new game to db from request body via Game model
    await URL.create(req.body);

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
 *        description: URL updated successfully
 *      400:
 *        description: Id missing - Bad Requests
 */
export const updateURL = async (req: Request, res: Response) => {
    // validate we have an id value
    if (!req.params.id) {
        return res.status(400).json({ 'error': 'Bad Request - Id parameter missing' });
    }

    await URL.findByIdAndUpdate(req.params.id, req.body);
    return res.status(204).json({ 'msg': 'URL Updated' }); // 204: No Content
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
 *        description: Game deleted successfully
 *      400:
 *        description: Id Missing - Bad Request
 */
export const deleteURL = async (req: Request, res: Response) => {
    try {
        // validate we have an id value
        if (!req.params.id) {
            return res.status(400).json({ error: 'Bad Request - Id parameter missing' });
        }

        const deletedURL = await URL.findByIdAndDelete(req.params.id);

        if (!deletedURL) {
            return res.status(404).json({ error: 'URL Not Found' });
        }

        return res.status(204).send(); // 204: No Content
    } catch (error: any) { 
        if (error?.name === 'CastError')  return res.status(400).json({ error: 'Bad Request - Invalid Id format' }); 
        else return res.status(500).json({ error: 'Internal Server Error' }); }
};
