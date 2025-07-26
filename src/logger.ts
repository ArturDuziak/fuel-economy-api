import * as dotenv from 'dotenv';
import { pino } from 'pino';

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

const logLevel = process.env.LOG_LEVEL || 'info';

export const logger: pino.Logger = isProduction
  ? pino({
      level: logLevel,
      timestamp: pino.stdTimeFunctions.isoTime,
      messageKey: 'msg',
    })
  : pino({
      level: logLevel,
      transport: {
        targets: [
          {
            level: logLevel,
            target: 'pino-pretty',
            options: {
              translateTime: 'yyyy-mm-dd HH:MM:ss.l Z',
              colorize: true,
              singleLine: true,
            },
          },
        ],
      },
    });
