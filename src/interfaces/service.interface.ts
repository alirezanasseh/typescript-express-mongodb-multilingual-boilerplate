import {IUser} from './user.interface';
import {FilterQuery} from 'mongoose';
import * as mongoose from 'mongoose';

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
    error?: string;
}

export interface IAuth {
    user: IUser;
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