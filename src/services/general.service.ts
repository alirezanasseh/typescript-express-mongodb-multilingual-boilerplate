import * as mongoose from 'mongoose';
import {Normalize, Paginate, Multilingual, AccessControl} from '../utils';
import {
    IDeleteProps,
    IGetMany,
    IGetOne,
    IReadProps,
    IService,
    IServiceProps,
    IUpdateProps,
    IUser
} from '../interfaces';
import {FilterQuery} from 'mongoose';

export default class GeneralService {
    private readonly model: mongoose.Model<any>;
    private readonly currentUser: IUser | undefined;
    private readonly locale: string;

    constructor(props: IServiceProps) {
        this.model = props.model;
        this.currentUser = props.currentUser;
        this.locale = props.locale;
    }

    public async create<T> (entityDTO: Partial<T>): Promise<IService<object>> {
        try {
            // Access control
            const AC = new AccessControl({
                user: this.currentUser,
                entity: this.model.modelName
            });
            const acResult = await AC.create<T>(entityDTO);
            if (!acResult.access) return {error: 'access_denied'};

            // Performing multilingual process
            const ML = new Multilingual({
                locale: this.locale,
                entity: this.model.modelName
            });
            const mlResult = ML.create(acResult.entity);

            const newEntity = await this.model.create(mlResult);
            if (newEntity) {
                return {result: {id: newEntity._id}};
            } else {
                return {error: 'entity_not_created'};
            }
        } catch (e) {
            throw e;
        }
    }

    public async getMany<T> (props: IReadProps<T>): Promise<IService<IGetMany<T>>> {
        try {
            // Access control
            const AC = new AccessControl({
                user: this.currentUser,
                entity: this.model.modelName
            });
            const acResult = await AC.read<T>(props.filter)
            if (!acResult.access) return {error: 'access_denied'};
            props = {...props, filter: acResult.filter};

            const paginate = Paginate(props);
            let projection = Normalize(this.model.modelName, props.projection);
            const count = await this.model.countDocuments(paginate.filter);
            const list = await this.model.find(paginate.filter, projection, paginate.options).lean();

            // Performing multilingual process
            const ML = new Multilingual({
                locale: this.locale,
                entity: this.model.modelName
            });
            const processedList = ML.getMany(list);

            return {result: {count, list: processedList}};
        } catch (e) {
            throw e;
        }
    }

    public async getOne<T> (props: IReadProps<T>): Promise<IService<IGetOne<T>>> {
        try {
            // Access control
            const AC = new AccessControl({
                user: this.currentUser,
                entity: this.model.modelName
            });
            const acResult = await AC.read<T>(props.filter)
            if (!acResult.access) return {error: 'access_denied'};
            props = {...props, filter: acResult.filter};

            const projection = Normalize(this.model.modelName, props.projection);
            const item = await this.model.findOne(props.filter, projection).lean();

            // Performing multilingual process
            const ML = new Multilingual({
                locale: this.locale,
                entity: this.model.modelName
            });
            const processedItem = ML.getOne(item);

            return {result: {item: processedItem}};
        } catch (e) {
            throw e;
        }
    }

    public async update<T> (props: IUpdateProps<T>): Promise<IService<object>> {
        try {
            // Access control
            const AC = new AccessControl({
                user: this.currentUser,
                entity: this.model.modelName
            });
            const acResult = await AC.update<T>({_id: props.id} as FilterQuery<T>)
            if (!acResult.access) return {error: 'access_denied'};

            const item = await this.model.findOne(acResult.filter);

            // Perform multilingual process
            const ML = new Multilingual({
                locale: this.locale,
                entity: this.model.modelName
            });
            const processedUpdate = ML.update(item, props.update);

            const result = await item.updateOne(processedUpdate);

            // const result = await this.model.updateOne(processed.props.filter, processed.props.update);
            return {result};
        } catch (e) {
            throw e;
        }
    }

    public async remove<T> (props: IDeleteProps): Promise<IService<object>> {
        try {
            // Access control
            const AC = new AccessControl({
                user: this.currentUser,
                entity: this.model.modelName
            });
            const acResult = await AC.delete<T>({_id: props.id} as FilterQuery<T>)
            if (!acResult.access) return {error: 'access_denied'};

            const result = await this.model.deleteOne(acResult.filter);
            return {result};
        } catch (e) {
            throw e;
        }
    }
}