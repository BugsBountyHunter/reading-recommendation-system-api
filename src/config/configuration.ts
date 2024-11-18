import { Environment } from '@app/config/env.validation';

export interface Configuration {
  app: AppSettings;
  postgresDatabase: PostgresDatabase;
}

export interface AppSettings {
  env: string;
  port: number;
}

export interface PostgresDatabase {
  host: string;
  name?: string;
  database: string;
  username: string;
  password: string;
  port: number;
  ssl: boolean | PostgresDatabaseSSL;
}

export interface PostgresDatabaseSSL {
  rejectUnauthorized: boolean;
  ca: string;
  cert: string;
  key: string;
}

export const configuration = (): Configuration => ({
  app: {
    env: process.env.NODE_ENV || Environment.DEVELOPMENT,
    port: parseInt(process.env.PORT, 10) || 3000,
  },
  postgresDatabase: {
    host: process.env.POSTGRES_HOST as string,
    database: process.env.POSTGRES_DATABASE as string,
    username: process.env.POSTGRES_USERNAME as string,
    password: process.env.POSTGRES_PASSWORD as string,
    port: parseInt(process.env.POSTGRES_PORT as string),
    ssl:
      process.env.SSL && process.env.SSL == 'true'
        ? {
            rejectUnauthorized:
              process.env.REJECT_UNAUTHORIZED &&
              process.env.REJECT_UNAUTHORIZED == 'true',
            ca: process.env.CA,
            cert: process.env.CERT,
            key: process.env.KEY,
          }
        : false,
  },
});
