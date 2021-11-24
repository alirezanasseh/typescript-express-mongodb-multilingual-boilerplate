import * as mongoose from 'mongoose';
import {Normalize, Multilingual, AccessControl, MultilingualPopulate} from '../utils';
import {
    IDeleteProps,
    IGetMany,
    IGetOne,
    IReadProps,
    IService,
    IServiceProps,
    IUpdateProps
} from '../interfaces/system';
import {IUser} from "../interfaces/project";
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
            const acResult = await AC.read<T>(props.filter);
            if (!acResult.access) return {error: 'access_denied'};

            let projection = Normalize(this.model.modelName, props.projection);
            const count = await this.model.countDocuments(acResult.filter);
            let list;
            if (props.populate) {
                list = await this.model.find(acResult.filter, projection, props.options).lean().populate(props.populate);
            } else {
                list = await this.model.find(acResult.filter, projection, props.options).lean();
            }

            // Performing multilingual process
            const ML = new Multilingual({
                locale: this.locale,
                entity: this.model.modelName,
                populated: MultilingualPopulate({
                    model: this.model,
                    populate: props.populate
                })
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

            const projection = Normalize(this.model.modelName, props.projection);
            let item;
            if (props.populate) {
                item = await this.model.findOne(acResult.filter, projection).lean().populate(props.populate);
            } else {
                item = await this.model.findOne(acResult.filter, projection).lean();
            }

            // Performing multilingual process
            const ML = new Multilingual({
                locale: this.locale,
                entity: this.model.modelName,
                populated: MultilingualPopulate({
                    model: this.model,
                    populate: props.populate
                })
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
            const acResult = await AC.update<T>({_id: props.id} as FilterQuery<T>, props.update);
            if (!acResult.access) return {error: 'access_denied'};

            const item = await this.model.findOne(acResult.filter);

            if (item) {
                // Perform multilingual process
                const ML = new Multilingual({
                    locale: this.locale,
                    entity: this.model.modelName
                });
                const processedUpdate = ML.update(item, acResult.update);

                const result = await item.updateOne(processedUpdate);

                return {result};
            } else {
                return {error: 'not_found'};
            }
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