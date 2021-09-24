import {Joi} from 'celebrate';

const PermissionFields = {
    role: Joi.string().required(),
    entity: Joi.string().required(),
    allowed: Joi.array().items(Joi.string()).required(),
    create: Joi.any(),
    read: Joi.any(),
    update_filter: Joi.any(),
    update_update: Joi.any(),
    delete: Joi.any(),
};

export const PermissionCreate = {
    body: Joi.object({...PermissionFields})
};

export const PermissionUpdate = {
    body: Joi.object(PermissionFields).fork(Object.keys(PermissionFields), (schema => schema.optional()))
};
