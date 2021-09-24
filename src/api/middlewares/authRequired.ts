import {Request, Response, NextFunction} from 'express';

const authRequired = (req: Request, res: Response, next: NextFunction) => {
    if (!req.token) {
        next(new Error('Access denied'));
    }
};

export default authRequired;