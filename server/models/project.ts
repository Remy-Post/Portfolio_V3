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
    languages: mongoose.Types.ObjectId[] | ILanguage[];
}

const projectSchema = new Schema<IProject>({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        maxlength: [50, 'Name must be less than 50 characters'],
    },
    description: {
        type: String, trim: true,
        required: [true, 'Description is required'],
        maxlength: [500, 'Description must be less than 500 characters'],
    },
    shortDescription: {
        type: String, trim: true,
        maxlength: [100, 'Short description must be less than 100 characters'],
        required: [true, 'Short description is required'],
    },
    url: {
        type: String, trim: true,
        required: [true, 'URL is required'],
        validate: {
            validator: (value: string) => {
                return URL_REGEX.test(value);
            },
            message: 'Invalid URL',
        },
    },
    githubUrl: {
        type: String, trim: true,
        required: [true, 'GitHub URL is required'],
        validate: {
            validator: (value: string) => {
                return URL_REGEX.test(value);
            },
            message: 'Invalid GitHub URL',
        },
    },
    languages: [{
        type: Schema.Types.ObjectId,
        ref: 'Language',
    }],
});

export default mongoose.model<IProject>('Project', projectSchema);