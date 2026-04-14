import mongoose, { Model, Schema } from 'mongoose';
import { TAILWIND_COLOR_CLASS_REGEX, URL_REGEX } from '../util';
import { Proficiency } from '../../util';



interface ILanguage {
    name: string;
    colour: string; //Tailwind CSS color code
    proficiency: Proficiency; 
    similarLanguages: string[];
    projects: string[];
    icon: string; //Icon name from Lucide React
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
    }
});

export default mongoose.model<ILanguage>('Language', languageSchema);

/**
 * 
 * For each coding language, Please provide this in json format.



-> "name": "LANGUAGE",

     "colour": "ACTUAL CSS SECONDAIRY COLOUR",

     "icon" : "REPLACED WITH THE REQUESTED LANGUAGE, https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg
 */