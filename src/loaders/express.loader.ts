import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import routes from '../api';
import cookieParser from 'cookie-parser';
import config from '../config';
import middlewares from '../api/middlewares';

export default ({app}: { app: express.Application }) => {
    /**
     * Health Check endpoints
     */
    app.get('/status', (req, res) => {
        res.status(200).end();
    });
    app.head('/status', (req, res) => {
        res.status(200).end();
    });

    // Useful if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
    // It shows the real origin IP in the heroku or Cloudwatch logs
    app.enable('trust proxy');

    app.use(cors({
        origin: (origin, callback) => {
            if (config.origins && origin && config.origins.indexOf(origin) > -1) {
                callback(null, true);
            } else {
                callback(null, true);
                // callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true
    }));

    // Middleware that transforms the raw string of req.body into json
    app.use(bodyParser.json());

    // Middleware to read cookies for the httponly token
    app.use(cookieParser());

    // Load locale
    app.use(middlewares.attachLocale);

    // Load API routes
    app.use(routes());

    // catch 404 and forward to error handler
    app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
        const err = new Error('Not Found');
        next(err);
    });

    // UnAuthorized error
    app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
        /**
         * Handle 401 thrown by express-jwt library
         */
        if (err.name === 'UnauthorizedError') {
            console.log(err);
            return res.status(401).send({errors: {message: config.locale_dict[req.locale || 'en'].unauthorized}}).end();
        }
        return next(err);
    });

    // Other errors
    app.use((err: Error, req: express.Request, res: express.Response) => {
        console.log(err);
        res.status(500);
        res.json({
            errors: {
                message: err.message
            }
        });
    });
};