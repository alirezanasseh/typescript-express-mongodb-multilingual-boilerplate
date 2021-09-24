import {IRole} from './role.interface';

export interface IUser {
    _id: string;
    name?: string;
    family: string;
    email: string;
    password: string;
    salt: string;
    role: IRole;
    bio: string;    // This field is multilingual
}

export type IUserDTO = Omit<IUser, '_id' | 'salt' | 'role'>;