import {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import config from '../../config';

const authCheck = (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.cookies.token) {
            const decoded = jwt.verify(req.cookies.token, config.jwtSecret, {
                algorithms: ['RS256']
            });
            req.token = decoded as typeof req.token;
        }
        return next();
    } catch (e) {
        return next(e);
    }
};

export default authCheck;