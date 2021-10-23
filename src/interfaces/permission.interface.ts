import {FilterQuery} from 'mongoose';
import {IRole} from ".";

export interface IPermission {
    role: IRole,
    entity: string;
    allowed: Array<'create' | 'read' | 'update' | 'delete'>;
    create: any;
    read: FilterQuery<any>;
    update_filter: FilterQuery<any>;
    update_update: any;
    delete: FilterQuery<any>;
}
