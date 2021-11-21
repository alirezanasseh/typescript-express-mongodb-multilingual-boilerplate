import {Router} from 'express';
import {celebrate} from 'celebrate';
import * as Validator from '../../validators';
import * as Controller from '../../controllers/auth.controller';
import authCheck from '../middlewares/authCheck';
import attachCurrentUser from '../middlewares/attachCurrentUser';

const auth = (app: Router) => {
    const route = Router();
    app.use('/auth', route);

    route.post('/register', celebrate(Validator.Register), Controller.register);
    route.post('/login', celebrate(Validator.Login), Controller.login);
    route.post('/admin_login', celebrate(Validator.Login), Controller.admin_login);
    route.post('/logout', Controller.logout);
    route.post('/check', authCheck, Controller.check);
    route.post('/change_password', authCheck, attachCurrentUser, celebrate(Validator.ChangePassword), Controller.changePassword);
};

export default auth;