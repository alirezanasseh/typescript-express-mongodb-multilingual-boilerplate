import {QueryOptions} from 'mongoose';
import {IOptions} from '../interfaces';

export default function Paginate(options: IOptions | undefined): QueryOptions {
    try {
        let queryOptions: QueryOptions = {};
        if (options) {
            if (options.sort) queryOptions.sort = options.sort;
            if (!options.page) options.page = 1;
            if (!options.limit) options.limit = 25;
            queryOptions.limit = options.limit;
            queryOptions.skip = (options.page - 1) * options.limit;
        } else {
            queryOptions = {
                sort: '-_id',
                limit: 25,
                skip: 0
            };
        }
        return queryOptions;
    } catch (e) {
        throw e;
    }
}
