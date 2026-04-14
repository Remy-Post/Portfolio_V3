import express, { Application, Request, Response } from 'express';
import bodyParser from 'body-parser'; // accept json body in POST / PUT requests
import mongoose from 'mongoose';  // mongodb access lib
import cookieParser from 'cookie-parser';
import { getLanguages, getLanguage, createLanguage, updateLanguage, deleteLanguage } from './controllers/languages';
import { getProjects, getProject, createProject, updateProject, deleteProject } from './controllers/project';
import { getURLs, getURL, createURL, updateURL, deleteURL } from './controllers/URLcontroller';

const app: Application = express();

app.use(bodyParser.json());

const dbUri = process.env.DB!;

mongoose.connect(dbUri)
.then(() => { console.log('Connected to MongoDB') })
.catch((err: Error) => { console.log(`Connection Failed: ${err.message}`) });

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

// URLs
app.get('/api/v1/urls', getURLs);
app.get('/api/v1/urls/:id', getURL);
app.post('/api/v1/urls', createURL);
app.put('/api/v1/urls/:id', updateURL);
app.delete('/api/v1/urls/:id', deleteURL);

const PORT = process.env.SERVER_PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}).on('error', (err: Error) => {
  console.log(`Server error: ${err.message}`);
  process.exit(1);
});