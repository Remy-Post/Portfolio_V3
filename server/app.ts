import express, { Application, Request, Response } from 'express';
import bodyParser from 'body-parser'; // accept json body in POST / PUT requests
import mongoose from 'mongoose';  // mongodb access lib
import cookieParser from 'cookie-parser';

const app: Application = express();

app.use(bodyParser.json());

const dbUri = process.env.DB!;

mongoose.connect(dbUri)
.then(() => { console.log('Connected to MongoDB') })
.catch((err: Error) => { console.log(`Connection Failed: ${err.message}`) });

const PORT = process.env.SERVER_PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}).on('error', (err: Error) => {
  console.log(`Server error: ${err.message}`);
  process.exit(1);
});