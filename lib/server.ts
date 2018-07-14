import app from "./app";
import { config } from "./config/config";
import * as async from 'async';
import logger from './log/logger';
import * as mongoose from 'mongoose';

const PORT = process.env.NODE_ENV === 'production' ? (process.env.PORT || config.port) : config.devPort;

async.auto({
    mongo: function (cb) {
        setTimeout(() => {
            // mongoDB connect
            mongoose.connect(config.database, (err) => {
                if (err) {
                    console.log(err.toString());
                    logger.log('error', err.toString());
                    cb(err);
                    return;
                };
                console.log('connected to database');
                logger.log('info', 'connected to database');
                console.log('mongoDB init success.');
                logger.log('info', 'mongoDB init success.');
            });
            cb(null);
        }, 1500);
    },
    appExpress: function (cb) {
        app.listen(PORT, () => {
            console.log('Express server listening on port ' + PORT);
        });
    },
    uploadAPI: ['appExpress', function (results, cb) {
        // do something after setting up express.
        cb(null);
    }]
});