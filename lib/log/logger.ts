import * as winston from 'winston';
import * as path from 'path';

const filename = path.join(__dirname, 'info.log');
const MESSAGE = Symbol.for('message');
const jsonFormatter = (logEntry) => {
    const base = { timestamp: new Date() };
    const json = Object.assign(base, logEntry)
    logEntry[MESSAGE] = JSON.stringify(json);
    return logEntry;
}

class Logger {

    public logger: winston.Logger;
    
    constructor() {
        this.initLogger();  
    }

    private initLogger():void {
        this.logger = winston.createLogger({
            level: 'info',
            format: winston.format(jsonFormatter)(),
            transports: [
                new winston.transports.Console()
                // new winston.transports.File({
                //     filename: filename,
                //     level: 'info',
                //     maxsize: 5242880, //5MB
                //     maxFiles: 1,
                //     colorize: false
                // })
            ]
        })
    }
}

export default new Logger().logger;