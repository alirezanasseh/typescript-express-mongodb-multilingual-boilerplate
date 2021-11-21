import {IUser} from '../interfaces/project';
import config from '../config';
import jwt from 'jsonwebtoken';

export function generateToken(user: IUser) {
    // Set token expiration date to 60 days
    const today = new Date();
    const exp = new Date(today);
    exp.setDate(today.getDate() + 60);

    return jwt.sign({
        _id: user._id,
        role: user.role,
        name: user.name.trim(),
        exp: exp.getTime() / 1000
    }, config.jwtSecret, {
        algorithm: 'RS256'
    });
}
