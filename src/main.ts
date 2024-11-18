import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';

import { AppModule } from '@app/app.module';
import { Environment } from '@app/config/env.validation';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useLogger(app.get(Logger));
  const configuration = app.get(ConfigService);

  // api version prefix
  app.setGlobalPrefix('api');
  app.enableVersioning({ type: VersioningType.URI });

  app.use(helmet());
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('Reading Recommendation System API')
    .setDescription('API documentation for reading recommendation system')
    .setVersion('1.0')
    .addBearerAuth() // Adds Bearer Token Authentication
    .build();

  const document = SwaggerModule.createDocument(app, config);
  const environment = configuration.get<Environment>('app.env');
  if (environment !== Environment.PRODUCTION) {
    SwaggerModule.setup('api-docs', app, document); // Swagger UI available at /api-docs
  }

  const port = configuration.get<number>('app.port');
  await app.listen(port);
}
bootstrap();
