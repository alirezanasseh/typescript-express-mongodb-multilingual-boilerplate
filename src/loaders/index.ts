import {Application} from 'express';
import expressLoader from './express.loader';
import mongooseLoader from './mongoose.loader';

export default async ({expressApp}: {expressApp: Application}) => {
    try {
        await expressLoader({app: expressApp});
        await mongooseLoader();
    } catch (e) {
        console.log(e);
        throw e;
    }
};