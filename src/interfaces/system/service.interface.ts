import {IUser} from '../project/user.interface';
import * as mongoose from 'mongoose';
import translate from '../../locales/en.json';

export type IServerMessages = keyof typeof translate;

export interface IGetMany<T> {
    count: number;
    list: Array<T>;
    [x: string]: any;
}

export interface IGetOne<T> {
    item: T | null;
}

export interface IResult {
    result: boolean;
}

export interface ICreate {
    id: string;
}

export interface IService<T> {
    result?: T;
    error?: IServerMessages;
}

export interface IAuthRegister {
    id: string;
    token: string;
}

export interface IAuthLogin {
    item: Partial<IUser>;
    token: string;
}

export interface IOptions {
    sort?: string;
    limit?: number;
    page?: number;
}

export interface IReadProps<T> {
    filter: string;
    projection?: string;
    populate?: Array<{path: string; select: string}>;
    options?: IOptions;
}

export interface IUpdateProps<T> {
    id: string;
    update: Partial<T>;
}

export interface IDeleteProps {
    id: string;
}

export interface IServiceProps {
    model: mongoose.Model<any>;
    currentUser: IUser | undefined;
    locale: string;
}