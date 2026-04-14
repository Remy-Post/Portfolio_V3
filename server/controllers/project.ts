import express, { Request, Response } from 'express';
import Project from '../models/project';

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
    // use req.query property to check for any url search filter.  returns keys/vals after ? 
    const filter = req.query;

    // use model to query mongodb for game docs.  find() gets all docs, adding optional filter
    const projects = await Project.find(filter);

    if (!projects || projects.length === 0) {
        return res.status(404).json({ message: 'No projects found' });
    }

    return res.status(200).json(projects);
};  

export const getProject = async(req: Request, res: Response) => {
    // try to fetch selected project by its id from url param
    const project = await Project.findById(req.params.id);    

    // err handle
    if (!project) { return res.status(404).json({ message: 'Project Not Found' }) }

    // return selected project
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
        return res.status(400).json({ 'err': 'Invalid Request Body' }); // 400: Bad Request
    }

    // add new project to db from request body via Project model
    await Project.create(req.body);

    return res.status(201).json(); // 201: resource created
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
    // validate we have an id value
    if (!req.params.id) {
        return res.status(400).json({ 'error': 'Bad Request - Id parameter missing' });
    }

    await Project.findByIdAndUpdate(req.params.id, req.body);
    return res.status(204).json({ 'msg': 'Project Updated' }); // 204: No Content
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
     // validate we have an id value
    if (!req.params.id) {
        return res.status(400).json({ 'error': 'Bad Request - Id parameter missing' });
    }

    await Project.findByIdAndDelete(req.params.id);
     return res.status(204).json({ 'msg': 'Project Deleted' }); // 204: No Content
};
