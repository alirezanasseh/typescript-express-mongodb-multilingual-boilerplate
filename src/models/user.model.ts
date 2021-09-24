import mongoose, {Schema} from 'mongoose';
import validator from 'validator';
import {roles} from '../config/roles';
import argon2 from 'argon2';
import {randomBytes} from 'crypto';
import {IUser} from '../interfaces';

interface IUserDocument extends IUser, Document {
    isPasswordMatch: (password: string) => boolean;
}

interface IUserModel extends mongoose.Model<IUserDocument> {
    isEmailTaken: (email: string, excludeUserId?: string) => boolean;
}

const OTPSchema = new Schema({
    value: String,
    retries: Number,
    generatedTimestamp: Number,
    period: Number
});

const userSchema = new Schema<IUserDocument>(
    {
        name: {
            type: String,
            trim: true
        },
        family: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            validate(value: string) {
                if (!validator.isEmail(value)) {
                    throw new Error('Invalid email');
                }
            }
        },
        password: {
            type: String,
            required: true,
            trim: true,
            private: true
        },
        salt: {
            type: String,
            private: true
        },
        role: {
            type: String,
            enum: roles,
            default: 'user'
        },
        bio: String
    },
    {
        timestamps: true
    }
);

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
    let user;
    if (excludeUserId) {
        user = await this.findOne({ email, _id: { $ne: excludeUserId } });
    } else {
        user = await this.findOne({ email });
    }
    return !!user;
};

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.methods.isPasswordMatch = async function (password) {
    const user = this;
    return await argon2.verify(user.password, password);
};

userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        const salt = randomBytes(32);
        user.password = await argon2.hash(user.password, {salt});
        user.salt = salt.toString('hex');
    }
    next();
});

/**
 * @typedef User
 */
const User = mongoose.model<IUserDocument, IUserModel>('User', userSchema);

export default User;