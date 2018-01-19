import { transports, createLogger, format } from 'winston';
import * as path from 'path';

export default createLogger({
    transports: [
        new transports.Console({
            colorize: true,
            level: 'debug',
            label: path
        }),
        new transports.File({ filename: 'src/logs/combined.log' })
    ]
});