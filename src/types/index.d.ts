import {IUser} from '../interfaces';

declare global {
    namespace Express {
        export interface Request {
            locale: string;
            currentUser?: IUser;
            token?: {
                _id: string;
                role: string;
                full_name: string;
                exp: number;
            }
        }
    }
}