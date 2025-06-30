import { createLogger, format, transports, Logger } from "winston";
import * as morgan from 'morgan';
import { StreamOptions } from 'morgan';
import { TransformableInfo } from 'logform';
import * as fs from 'fs';
import * as path from 'path';

// Ensure logs directory exists
const logDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

// Define log format
const logFormat = format.printf(
    ({ timestamp, level, message, ...meta }: TransformableInfo) =>
        `${timestamp} :: [${level.toUpperCase()}] :: ${message}${Object.keys(meta).length ? ` :: ${JSON.stringify(meta)}` : ''}`
);

// Create the Winston logger
const logger: Logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        logFormat
    ),
    transports: [
        new transports.Console({
            format: format.combine(format.colorize(), logFormat),
        }),
        new transports.File({ filename: path.join(logDir, 'error.log'), level: 'error' }),
        new transports.File({ filename: path.join(logDir, 'combined.log') }),
    ],
});

// Morgan stream config using Winston
const stream: StreamOptions = {
    write: (message: string) => logger.info(message.trim()),
};

// HTTP request logger middleware
const httpLogger = morgan(
    ':method :url :status :response-time ms - :res[content-length]',
    { stream }
);

export { logger, httpLogger };
