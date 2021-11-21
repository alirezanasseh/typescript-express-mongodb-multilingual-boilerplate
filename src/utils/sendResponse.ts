import httpStatus from 'http-status';
import {Response} from 'express';
import {IService} from '../interfaces/system';
import config from '../config';

interface ISendResponseProps {
    res: Response;
    response: IService<object>;
    status?: number;
    locale?: string;
    token?: string;
}

const sendResponse = (props: ISendResponseProps) => {
    let {
        res,
        response,
        status = httpStatus.OK,
        locale = 'en',
        token
    } = props;

    if (response?.result) {
        if (token) {
            // Set token in cookie
            res.cookie('token', token, {
                maxAge: 7 * 24 * 3600 * 1000,
                httpOnly: true,
                sameSite: 'none',
                secure: config.nodeEnv === 'production'     // In production cookies must be secure and in development not secure
            });
            res.status(status);
            res.json(response.result);
        } else {
            // Send success response
            res.status(status);
            res.json(response.result);
        }
    } else if (response?.error) {
        // Checking this language exists, if not set language to en
        if(!config.locale_dict[locale]) {
            locale = 'en';
        }

        // Getting error translation
        let error = config.locale_dict[locale][response.error] ?? response.error;

        // Send error response
        res.status(status);
        res.json({errors: {message: error}});
    } else {
        // Send unknown error response
        res.status(httpStatus.INTERNAL_SERVER_ERROR);
        res.json('System error');
    }
};

export default sendResponse;