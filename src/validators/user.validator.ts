import {Joi} from 'celebrate';

const UserFields = {
    name: Joi.string().optional().allow(''),
    family: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    role: Joi.string().optional().valid('user', 'tutor', 'admin'),
    bio: Joi.string().optional().allow('')
};

export const UserCreate = {
    body: Joi.object({...UserFields})
};

// Update fields can be empty
export const UserUpdate = {
    body: Joi.object(UserFields).fork(Object.keys(UserFields), (schema => schema.optional()))
};
