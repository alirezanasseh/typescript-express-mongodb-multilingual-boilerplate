import {IUser} from '../interfaces';
import config from '../config';
import jwt from 'jsonwebtoken';

export default class TokenService {
    public generateToken(user: IUser) {
        // Set token expiration date to 60 days
        const today = new Date();
        const exp = new Date(today);
        exp.setDate(today.getDate() + 60);

        return jwt.sign({
            _id: user._id,
            role: user.role,
            full_name: (user.name + ' ' + user.family).trim(),
            exp: exp.getTime() / 1000
        }, config.jwtSecret, {
            algorithm: 'RS256'
        });
    }
}