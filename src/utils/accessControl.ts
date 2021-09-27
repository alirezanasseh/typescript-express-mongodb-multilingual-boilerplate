import {IUser} from '../interfaces';
import {Permission} from '../models';
import {FilterQuery} from 'mongoose';

type TAction = 'create' | 'read' | 'update' | 'delete';

interface IACProps {
    user: IUser | undefined;
    entity: string;
}

interface IACCreate<T> {
    access: boolean;
    entity: Partial<T>;
}

interface IACRead<T> {
    access: boolean;
    filter: FilterQuery<T>;
}

export default class AccessControl {
    private user: IUser | undefined;
    private readonly role: string;
    private entity: string;

    constructor(props: IACProps) {
        this.user = props.user;
        this.role = props.user ? props.user.role : 'guest';
        this.entity = props.entity;
    }

    private async checkPermission(action: TAction) {
        try {
            // If role is admin everything is allowed
            if (this.role === 'admin') {
                return {
                    create: {},
                    read: {},
                    update_filter: {},
                    delete: {}
                };
            }

            return await Permission.findOne({
                role: this.role,
                entity: this.entity,
                allowed: action
            }).lean();
        } catch (e) {
            throw e;
        }
    }

    private prepareAccessObject(accessObj: any): any {
        // Iterating through permission create to replace $uid by user.id
        for (const [key, value] of Object.entries(accessObj)) {
            if (value === '$uid') {
                accessObj[key] = this.user?._id || '';
            }
        }
        return accessObj;
    }

    public async create<T>(creatingEntity: Partial<T>): Promise<IACCreate<T>> {
        try {
            const permission = await this.checkPermission('create');
            if (!permission) return {access: false, entity: {}};

            let processedEntity = {...creatingEntity};
            if (permission.create) {
                const accessObj = this.prepareAccessObject(permission.create);
                processedEntity = {...processedEntity, ...accessObj};
            }
            return {access: true, entity: processedEntity};
        } catch (e) {
            throw e;
        }
    }

    public async read<T>(filter: string): Promise<IACRead<T>> {
        try {
            const permission = await this.checkPermission('read');
            if (!permission) return {access: false, filter: {}};

            let processedFilter = JSON.parse(filter);
            if (permission.read) {
                const accessObj = this.prepareAccessObject(permission.read);
                processedFilter = {...processedFilter, ...accessObj};
            }
            return {access: true, filter: processedFilter};
        } catch (e) {
            throw e;
        }
    }

    public async update<T>(filter: FilterQuery<T>): Promise<IACRead<T>> {
        try {
            const permission = await this.checkPermission('update');
            if (!permission) return {access: false, filter: {}};

            let processedFilter = filter;
            if (permission.update_filter) {
                const accessObj = this.prepareAccessObject(permission.update_filter);
                processedFilter = {...processedFilter, ...accessObj};
            }
            return {access: true, filter: processedFilter};
        } catch (e) {
            throw e;
        }
    }

    public async delete<T>(filter: FilterQuery<T>): Promise<IACRead<T>> {
        try {
            const permission = await this.checkPermission('delete');
            if (!permission) return {access: false, filter: {}};

            let processedFilter = filter;
            if (permission.delete) {
                const accessObj = this.prepareAccessObject(permission.delete);
                processedFilter = {...processedFilter, ...accessObj};
            }
            return {access: true, filter: processedFilter};
        } catch (e) {
            throw e;
        }
    }
}