import {Joi} from 'celebrate';

export const Register = {
    body: Joi.object({
        name: Joi.string().optional().allow(''),
        family: Joi.string().required(),
        email: Joi.string().required().email(),
        password: Joi.string().required().min(8)
    })
};

export const Login = {
    body: Joi.object({
        email: Joi.string().required().email(),
        password: Joi.string().required().min(8)
    })
};