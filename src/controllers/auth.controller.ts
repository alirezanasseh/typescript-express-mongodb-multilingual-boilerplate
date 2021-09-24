import {NextFunction, Request, Response} from 'express';
import {sendResponse} from '../utils';
import {AuthService} from '../services';
import httpStatus from 'http-status';

export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const AS = new AuthService();
        const response = await AS.register(req.body, 'user');
        sendResponse({res, response, locale: req.locale, token: response.result?.token});
    } catch (e) {
        return next(e);
    }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const AS = new AuthService();
        const response = await AS.login(req.body.email, req.body.password, 'user');
        sendResponse({res, response, locale: req.locale, token: response.result?.token})
    } catch (e) {
        return next(e);
    }
};

export const admin_login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const AS = new AuthService();
        const response = await AS.login(req.body.email, req.body.password, 'admin');
        sendResponse({res, response, locale: req.locale, token: response.result?.token})
    } catch (e) {
        return next(e);
    }
};

export const logout = (req: Request, res: Response, next: NextFunction) => {
    try {
        res.clearCookie('token').sendStatus(httpStatus.OK);
    } catch (e) {
        return next(e);
    }
};