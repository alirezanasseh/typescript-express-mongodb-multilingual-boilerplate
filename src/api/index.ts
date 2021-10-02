import {Router} from 'express';
import {errors} from 'celebrate';
import * as Route from './routes';
import * as Interface from '../interfaces';
import * as Model from '../models';
import * as Validator from '../validators';
import middleware from './middlewares';

export default () => {
    const app = Router();

    Route.auth(app);

    app.use(middleware.authCheck);
    app.use(middleware.attachCurrentUser);

    Route.upload(app);

    Route.general<Interface.IUser>(app, '/users', Model.User, Validator.UserCreate, Validator.UserUpdate);

    // Adding celebrate error handling
    app.use(errors());

    return app;
};
