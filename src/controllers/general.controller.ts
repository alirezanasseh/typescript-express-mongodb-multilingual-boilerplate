import {NextFunction, Request, Response} from 'express';
import {sendResponse} from '../utils';
import {GeneralService} from '../services';
import * as mongoose from 'mongoose';
import {IOptions} from '../interfaces';

export const create = async <T>(req: Request, res: Response, next: NextFunction, model: mongoose.Model<T>) => {
    try {
        const US = new GeneralService({
            model,
            currentUser: req.currentUser,
            locale: req.locale
        });
        const response = await US.create(req.body);
        sendResponse({
            res,
            response,
            locale: req.locale
        });
    } catch (e) {
        return next(e);
    }
};

export const getMany = async <T>(req: Request, res: Response, next: NextFunction, model: mongoose.Model<T>) => {
    try {
        const US = new GeneralService({
            model,
            currentUser: req.currentUser,
            locale: req.locale
        });

        const options: IOptions = {};
        if (req.query.sort) {
            options.sort = req.query.sort as string;
        }
        if (req.query.pageSize) {
            options.limit = parseInt(req.query.pageSize.toString());
        }
        if (req.query.page) {
            options.page = parseInt(req.query.page.toString());
        }

        const response = await US.getMany({
            filter: JSON.parse((req.query.conditions ?? '{}').toString()),
            projection: (req.query.fields ?? '').toString(),
            options
        });
        sendResponse({
            res,
            response,
            locale: req.locale
        });
    } catch (e) {
        return next(e);
    }
};

export const getOne = async <T>(req: Request, res: Response, next: NextFunction, model: mongoose.Model<T>) => {
    try {
        const US = new GeneralService({
            model,
            currentUser: req.currentUser,
            locale: req.locale
        });
        const response = await US.getOne({
            filter: {_id: req.params.id},
            projection: (req.query.fields ?? '').toString()
        });
        sendResponse({
            res,
            response,
            locale: req.locale
        });
    } catch (e) {
        return next(e);
    }
};

export const update = async <T>(req: Request, res: Response, next: NextFunction, model: mongoose.Model<T>) => {
    try {
        const US = new GeneralService({
            model,
            currentUser: req.currentUser,
            locale: req.locale
        });
        const response = await US.update({id: req.params.id, update: req.body});
        sendResponse({
            res,
            response,
            locale: req.locale
        });
    } catch (e) {
        return next(e);
    }
};

export const remove = async <T>(req: Request, res: Response, next: NextFunction, model: mongoose.Model<T>) => {
    try {
        const US = new GeneralService({
            model,
            currentUser: req.currentUser,
            locale: req.locale
        });
        const response = await US.remove({id: req.body.id});
        sendResponse({
            res,
            response,
            locale: req.locale
        });
    } catch (e) {
        return next(e);
    }
};