import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as morgan from 'morgan';
import logger from './log/logger';
import { accountRouter } from './routes/accounts';

class App {

    public app: express.Application;

    constructor() {
        this.app = express();
        this.config();
    }

    private config(): void {
        this.app.use(cors());
        // support application/json type post data
        this.app.use(bodyParser.json());
        //support application/x-www-form-urlencoded post data
        this.app.use(bodyParser.urlencoded({ extended: false }));

        this.app.use(morgan('dev'));
        this.app.use(morgan('combined', {
            stream: {
                write: (message) => logger.info(message)
            }
        }));
        this.app.use('/doc', express.static(__dirname + '/public'));
        this.app.use('/api/accounts', accountRouter);
    }

}

export default new App().app;