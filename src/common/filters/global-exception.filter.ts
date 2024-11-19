import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { IResponse } from '@app/common/utils/iresponse';

@Catch()
export class GlobalExceptionFilter<T extends Error> implements ExceptionFilter {
  constructor(
    @InjectPinoLogger(GlobalExceptionFilter.name)
    private readonly logger: PinoLogger,
  ) {}

  catch(exception: T, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const request = context.getRequest<Request>();
    const response = context.getResponse<Response>();

    // Determine error details
    const status =
      (exception as any).status || HttpStatus.INTERNAL_SERVER_ERROR; // Allow for custom exceptions
    const errorResponse = {
      statusCode: status,
      message: exception.message || 'Internal server error',
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    // Enhanced structured logging
    this.logger.error({
      exceptionName: exception.name,
      exceptionMessage: exception.message,
      stackTrace: exception.stack,
      request: {
        method: request.method,
        url: request.url,
        headers: request.headers,
        body: request.body,
        params: request.params,
        query: request.query,
      },
      response: {
        statusCode: status,
      },
    });

    // Return consistent response structure
    response.status(status).json(<IResponse<null>>{
      statusCode: status,
      message: errorResponse.message,
      errors: exception.stack ? { stack: exception.stack } : null, // Include stack trace only in dev
    });
  }
}
