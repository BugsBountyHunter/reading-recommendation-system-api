import { config } from 'dotenv';
import { Params } from 'nestjs-pino';
import { Environment } from '@app/config/env.validation';

config();

const pinoConfig: Params = {
  pinoHttp: {
    level: process.env.NODE_ENV === Environment.PRODUCTION ? 'info' : 'debug',
    transport:
      process.env.NODE_ENV !== Environment.PRODUCTION
        ? {
            target: 'pino-pretty',
            options: {
              colorize: true,
              translateTime: 'yyyy-mm-dd HH:MM:ss.l o', // Matches the NestJS log time format
              singleLine: true,
              levelFirst: true,
              messageFormat: '[Pino] {pid}  - {time}     {msg} {context}', // Mimics NestJS's format
              ignore: 'time,level,pid,hostname',
            },
          }
        : undefined,
    serializers: {
      req: (req) => ({
        method: req.method,
        url: req.url,
        headers: req.headers,
      }),
      res: (res) => ({
        statusCode: res.statusCode,
      }),
    },
    timestamp: () => `,"time":"${new Date().toISOString()}"`, // ISO string for consistent timestamp format
  },
};

export default pinoConfig;
