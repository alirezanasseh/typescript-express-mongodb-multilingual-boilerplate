import {Request, Response, NextFunction, Router} from 'express';
import middlewares from '../middlewares';
import config from '../../config';
import AWS from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3';
import mime from 'mime-types';
import {sendResponse} from '../../utils';

const s3 = new AWS.S3({
    accessKeyId: config.S3.access_key,
    secretAccessKey: config.S3.secret_key,
    endpoint: config.S3.endpoint,
    s3ForcePathStyle: true
});

const uploadMiddleware = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'files',
        acl: 'public',
        metadata: function (req: Request, file, cb) {
            cb(null, {fieldName: file.fieldname});
        },
        key: function (req: Request, file, cb) {
            let type = req.body?.type;
            type = type ? type + '_' : '';
            let ext = mime.extension(file.mimetype);
            let fileName = type + req.currentUser?._id + '_' + Date.now() + '.' + ext;
            cb(null, fileName);
        }
    })
});

const upload = (app: Router) => {
    const route = Router();
    app.use('/upload', route);

    route.use(middlewares.authRequired);

    route.post('/', uploadMiddleware.single('file'), async (req: Request, res: Response, next: NextFunction) => {
        try {
            const file = req.file as Express.MulterS3.File;
            sendResponse({res, response: {result: {item: {url: file?.location || ''}}}});
        } catch (e) {
            return next(e);
        }
    });
};

export default upload;