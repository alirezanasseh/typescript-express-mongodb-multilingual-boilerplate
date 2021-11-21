import {IUserRole} from './role.interface';

export interface IUser {
    _id: string;
    name: string;
    email: string;
    password: string;
    salt: string;
    role: IUserRole;
    bio: string;    // This field is multilingual
}

export type IUserDTO = Omit<IUser, '_id' | 'salt' | 'role'>;