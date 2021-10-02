import {Request} from 'express';
import {QueryOptions} from 'mongoose';

export default function Options(req: Request): QueryOptions {
    let skip = 0, limit = 25, sort = '-_id';
    if (req.query.sort) {
        sort = req.query.sort.toString();
    }
    if (req.query.pageSize) {
        const inputLimit = parseInt(req.query.pageSize.toString());
        if (inputLimit > 0) {
            limit = inputLimit
        }
    }
    if (req.query.page) {
        const page = parseInt(req.query.page.toString());
        if (page > 0) {
            skip = (page - 1) * limit;
        }
    }
    return {sort, limit, skip};
}