import mongoose from 'mongoose';
import { Db } from 'mongodb';
import config from '../config';

export default async (): Promise<Db> => {
    try {
        const connection = await mongoose.connect(config.databaseURL || '');
        return connection.connection.db;
    } catch (e) {
        throw e;
    }
};

export async function withTransaction (func: any) {
    const session = await mongoose.startSession();

    session.startTransaction();

    try {
        let result = await func(session);
        await session.commitTransaction();
        return result;
    } catch (error) {
        console.log("-----------------");
        console.log("transaction catch");
        console.log("-----------------");
        await session.abortTransaction();
        throw error;
    } finally {
        await session.endSession();
    }
}
