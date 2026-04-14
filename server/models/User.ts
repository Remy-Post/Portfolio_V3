import mongoose, { Model, Schema } from 'mongoose';
// import { PASSWORD_REGEX } from '../../util';

export interface IUser {
    username: string;
    password: string;
}

const userSchema = new Schema<IUser>({
    username: {
        type: String, trim: true,
        required: [true, 'Username is required'],
    },
    password: {
        type: String, trim: true,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters long'],
        maxlength: [100, 'Password must be less than 100 characters'],
        // validate: {
        //     validator: (value: string) => {
        //         return PASSWORD_REGEX.test(value);
        //     },
        //     message: 'Invalid Password',
        // },
    },
});