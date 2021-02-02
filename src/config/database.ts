import mongoose from 'mongoose';
import { APP_NAME, DB_NAME, DB_HOST, DB_PORT, DB_USER, DB_PASS, MONGODB_URI } from './enviroments';

import { logger } from '../lib/logger';


const connectDB = { url: MONGODB_URI || `mongodb://localhost/${DB_NAME}`};

if (DB_USER && DB_PASS && DB_HOST && DB_PORT)
connectDB.url = `mongodb://${encodeURIComponent(DB_USER)}:${encodeURIComponent(DB_PASS)}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;

mongoose.Promise = global.Promise;
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useUnifiedTopology', true);

const connection = (db: string) => {
    const connect = () => {
        mongoose.connect(db, { useNewUrlParser: true })
        .then(() => {
            logger.info(`Successfully connected ${APP_NAME} to ${db}`);
        })
        .catch(error => {
            logger.error(`Error connecting to database: ${error}`);
            return process.exit(1);
        });
    };
    connect();
  
    mongoose.connection.on("disconnected", connect);
}

export default connection(connectDB.url);
