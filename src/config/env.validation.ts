import { plainToInstance, Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  validateSync,
} from 'class-validator';

export enum Environment {
  LOCAL = 'local',
  DEVELOPMENT = 'development',
  TEST = 'test',
  STAGING = 'staging',
  PRODUCTION = 'production',
}

class EnvironmentVariables {
  // Application Validation
  @IsNotEmpty()
  @Transform(({ value }) => value.toLowerCase())
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsPositive()
  PORT: number;
  //Database Validation
  @IsNotEmpty()
  @IsString()
  POSTGRES_HOST: string;

  @IsNotEmpty()
  @IsString()
  POSTGRES_DATABASE: string;

  @IsNotEmpty()
  @IsString()
  POSTGRES_USERNAME: string;

  @IsNotEmpty()
  @IsString()
  POSTGRES_PASSWORD: string;

  @IsNotEmpty()
  @IsNumber()
  POSTGRES_PORT: number;

  @IsBoolean()
  SSL: boolean;

  @IsOptional()
  @IsBoolean()
  REJECT_UNAUTHORIZED?: boolean;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  CA?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  CERT?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  KEY?: string;
}

export function validate(
  config: Record<string, unknown>,
): EnvironmentVariables {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
}
