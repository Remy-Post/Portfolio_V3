import mongoose, { Model, Schema } from 'mongoose';
import { URL_REGEX } from '../util';

export interface IURL {
    originalUrl: string;
    shortUrl: string;

    description?: string;

    addedAt: Date;
    clicks: number;
    qrCode?: string;
}

const urlSchema = new Schema<IURL>({
    originalUrl: 
    { 
        type: String, 
        required: [true, 'Original URL is required'],
        minlength: [10, 'Original URL must be at least 10 characters long'],
        validate: {
            validator: (value: string) => {
               return URL_REGEX.test(value);
              },
            message: 'Invalid URL'
        }
    },
    shortUrl: 
    { 
        type: String, 
        required: [true, 'Short URL is required'],
        validate: {
            validator: (value: string) => {
               return URL_REGEX.test(value);
              },
            message: 'Invalid Short URL'
        }
    },
    addedAt: 
    { 
        type: Date, 
        default: Date.now 
    },
    clicks: 
    { 
        type: Number, 
        default: 0,
    },
    qrCode: 
    { 
        type: String, 
        default: null,
        validate: {
            validator: (value: string) => {
               return URL_REGEX.test(value);
              },
            message: 'Invalid QR Code'
        }
    },
    description: 
    { 
        type: String, 
        default: null,
        validate: {
            validator: (value: string) => {
               return (value).length > 0;
              },
            message: 'Description must be between 1 and 100 characters'
        }
    }
});

export default mongoose.model<IURL>('URL', urlSchema);