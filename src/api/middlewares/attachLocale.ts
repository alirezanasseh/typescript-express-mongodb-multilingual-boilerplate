import {Request, Response, NextFunction} from 'express';

const attachLocale = (req: Request, res: Response, next: NextFunction) => {
    try {
        req.locale = req.cookies.locale || req.body.locale || req.query.locale || 'en';
        return next();
    } catch (e) {
        return next(e);
    }
};

export default attachLocale;