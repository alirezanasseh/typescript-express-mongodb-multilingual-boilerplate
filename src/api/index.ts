import {Router} from 'express';
import {errors} from 'celebrate';
import auth from './routes/auth.route';
import general from './routes/general.route';
import upload from './routes/upload';
import * as Interface from '../interfaces';
import * as Model from '../models';
import * as Validator from '../validators';
import middleware from './middlewares';

export default () => {
    const app = Router();

    auth(app);

    app.use(middleware.authCheck);
    app.use(middleware.attachCurrentUser);

    upload(app);

    general<Interface.IUser>(app, '/users', Model.User, Validator.UserCreate, Validator.UserUpdate);

    // Adding celebrate error handling
    app.use(errors());

    return app;
};
