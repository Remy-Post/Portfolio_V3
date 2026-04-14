import mongoose, { Model, Schema } from 'mongoose';
import { TAILWIND_COLOR_CLASS_REGEX, URL_REGEX } from '../../util';

interface ILanguage {
    name: string;
    color: string; //Tailwind CSS color code
    icon: string; //Icon name from Lucide React
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
    color: {
        type: String, trim: true,
        required: [true, 'Color is required'],
        validate: {
            validator: (value: string) => {
               return TAILWIND_COLOR_CLASS_REGEX.test(value);
              },
            message: 'Invalid Tailwind CSS color code'
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