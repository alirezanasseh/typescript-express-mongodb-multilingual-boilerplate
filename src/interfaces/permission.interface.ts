import {FilterQuery} from 'mongoose';

export interface IPermission {
    role: string,
    entity: string;
    allowed: Array<'create' | 'read' | 'update' | 'delete'>;
    create: any;
    read: FilterQuery<any>;
    update_filter: FilterQuery<any>;
    update_update: any;
    delete: FilterQuery<any>;
}
