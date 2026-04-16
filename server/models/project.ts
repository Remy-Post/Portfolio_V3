import mongoose, { Schema } from 'mongoose';
import { URL_REGEX } from '../util';
import type { ILanguage } from './languages';

export interface IProject {
  _id: string;
  name: string;
  description: string;
  shortDescription: string;
  url: string;
  githubUrl: string;
  languages: string[] | ILanguage[];
}

const projectSchema = new Schema<IProject>({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [1, 'Name must be at least 1 character'],
    maxlength: [50, 'Name must be less than 50 characters'],
  },
  description: {
    type: String,
    trim: true,
    required: [true, 'Description is required'],
    maxlength: [500, 'Description must be less than 500 characters'],
  },
  shortDescription: {
    type: String,
    trim: true,
    required: [true, 'Short description is required'],
    maxlength: [100, 'Short description must be less than 100 characters'],
  },
  url: {
    type: String,
    trim: true,
    required: [true, 'URL is required'],
    validate: {
      validator: (value: string) => URL_REGEX.test(value),
      message: 'Invalid URL',
    },
  },
  githubUrl: {
    type: String,
    trim: true,
    required: [true, 'GitHub URL is required'],
    validate: {
      validator: (value: string) => URL_REGEX.test(value),
      message: 'Invalid GitHub URL',
    },
  },
  languages: [{ type: Schema.Types.ObjectId, ref: 'Language' }],
});

export default mongoose.model<IProject>('Project', projectSchema);
