import {NextFunction, Request, Response} from 'express';
import {sendResponse} from '../utils';
import {AuthService} from '../services';
import httpStatus from 'http-status';
import {IService} from '../interfaces/system';

export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const response = await AuthService.register(req.body, 'user');
        sendResponse({res, response, locale: req.locale, token: response.result?.token});
    } catch (e) {
        return next(e);
    }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const response = await AuthService.login(req.body.email, req.body.password, 'user');
        sendResponse({res, response, locale: req.locale, token: response.result?.token})
    } catch (e) {
        return next(e);
    }
};

export const admin_login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const response = await AuthService.login(req.body.email, req.body.password, 'admin');
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

export const check = (req: Request, res: Response, next: NextFunction) => {
    try {
        let response: IService<any>;

        if (req.token) {
            response = {result: {ok: true}};
        } else {
            response = {error: 'access_denied'};
        }

        sendResponse({res, response, locale: req.locale});
    } catch (e) {
        return next(e);
    }
};

export const changePassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let response: IService<any>;

        if (req.currentUser) {
            response = await AuthService.changePassword(req.currentUser, req.body.current, req.body.new);
        } else {
            response = {error: 'access_denied'};
        }

        sendResponse({res, response, locale: req.locale});
    } catch(e) {
        return next(e);
    }
};