import mongoose, { Schema } from 'mongoose';
import { TAILWIND_COLOR_CLASS_REGEX, URL_REGEX, Proficiency } from '../util';
import type { IProject } from './project';

export interface ILanguage {
    _id: string;
    name: string;
    colour: string;
    proficiency: Proficiency;
    similarLanguages: string[];
    projects: mongoose.Types.ObjectId[] | IProject[];
    icon: string;
    description: string;
}

const languageSchema = new Schema<ILanguage>({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        maxlength: [50, 'Name must be less than 50 characters'],
        validate: {
            validator: (value: string) => {
               return (value).length > 0 && (value).length < 50;
            },
            message: 'Name must be between 1 and 50 characters'
        }
    },
    colour: {
        type: String, trim: true,
        required: [true, 'Colour is required'],
        validate: {
            validator: (value: string) => {
               return TAILWIND_COLOR_CLASS_REGEX.test(value);
            },
            message: 'Invalid Tailwind CSS colour code'
        }
    },
    icon: {
        type: String,
        required: [true, 'Icon is required'],
        trim: true,
        validate: {
            validator: (value: string) => {
               return URL_REGEX.test(value);
            },
            message: 'Invalid Icon URL'
        }
    },
    proficiency: {
        type: Number,
        enum: [Proficiency.Beginner, Proficiency.Intermediate, Proficiency.Advanced, Proficiency.Expert],
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, 'Description must be less than 500 characters'],
    },
    similarLanguages: {
        type: [String],
    },
    projects: [{
        type: Schema.Types.ObjectId,
        ref: 'Project',
    }],
});

export default mongoose.model<ILanguage>('Language', languageSchema);