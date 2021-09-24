import {Request, Response, NextFunction} from 'express';
import {User} from '../../models';

const attachCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.token) {
            const userRecord = await User.findById(req.token._id);
            if (userRecord) {
                req.currentUser = userRecord.toObject();
            }
        }
        return next();
    } catch (e) {
        return next(e);
    }
};

export default attachCurrentUser;