import mongoose, { Schema } from 'mongoose';
import { TAILWIND_COLOR_CLASS_REGEX, URL_REGEX, Proficiency } from '../util';
import type { IProject } from './project';

export interface ILanguage {
  _id: string;
  name: string;
  colour: string;
  proficiency: Proficiency;
  similarLanguages: string[];
  projects: string[] | IProject[];
  icon: string;
  description: string;
}

const languageSchema = new Schema<ILanguage>({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [1, 'Name must be at least 1 character'],
    maxlength: [50, 'Name must be less than 50 characters'],
  },
  colour: {
    type: String,
    trim: true,
    required: [true, 'Colour is required'],
    validate: {
      validator: (value: string) => TAILWIND_COLOR_CLASS_REGEX.test(value) || /^#[0-9a-fA-F]{3,8}$/.test(value),
      message: 'Colour must be a Tailwind class or a hex value',
    },
  },
  icon: {
    type: String,
    required: [true, 'Icon is required'],
    trim: true,
    validate: {
      validator: (value: string) => URL_REGEX.test(value),
      message: 'Invalid Icon URL',
    },
  },
  proficiency: {
    type: Number,
    required: [true, 'Proficiency is required'],
    enum: [Proficiency.Beginner, Proficiency.Intermediate, Proficiency.Advanced, Proficiency.Expert],
  },
  description: {
    type: String,
    trim: true,
    default: '',
    maxlength: [500, 'Description must be less than 500 characters'],
  },
  similarLanguages: {
    type: [String],
    default: [],
  },
  projects: [{ type: Schema.Types.ObjectId, ref: 'Project' }],
});

export default mongoose.model<ILanguage>('Language', languageSchema);
