import dotenv from 'dotenv';
import fs from 'fs';
import {ILocaleDict} from '../interfaces';
import * as locales from '../locales';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

/** To create JWT key files run this command :
 * ssh-keygen -t rsa -b 4096 -m PEM -f jwtRS256.key
 */
const RSA_PRIVATE_KEY = fs.readFileSync(__dirname + '/../../jwtRS256.key');

// Loading language dictionary
let locale_dict: ILocaleDict = locales;

const envFound = dotenv.config();

if (envFound.error) {
    throw new Error('Could not find .env file!');
}

export default {
    port: parseInt(process.env.PORT || '8000', 10),
    databaseURL: process.env.MONGO_URI,
    origins: process.env.ORIGINS,
    jwtSecret: RSA_PRIVATE_KEY,
    locale_dict,
    S3: {
        access_key: process.env.S3_ACCESS_KEY,
        secret_key: process.env.S3_SECRET_KEY,
        endpoint: process.env.S3_ENDPOINT
    }
};