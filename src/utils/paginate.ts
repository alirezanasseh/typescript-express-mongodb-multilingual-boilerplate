import {QueryOptions} from 'mongoose';
import {IReadProps} from '../interfaces';

export default function Paginate(props: IReadProps<any>): Required<IReadProps<any>> {
    try {
        const {
            filter = {},
            projection = '',
            options = {}
        } = props;

        let queryOptions: QueryOptions = {};
        if (options.sort) queryOptions.sort = options.sort;
        if (!options.page) options.page = 1;
        if (!options.limit) options.limit = 25;
        queryOptions.limit = options.limit;
        queryOptions.skip = (options.page - 1) * options.limit;

        return {filter, projection, options: queryOptions};
    } catch (e) {
        throw e;
    }
}

