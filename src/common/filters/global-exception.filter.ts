import { IResponse } from '@app/common/utils/iresponse';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

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

    this.logger.error({
      request: { ...request },
      response: { ...response },
      exception: { ...exception },
    });

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).send(<IResponse<string>>{
      errors: { ...exception },
      message: exception.message,
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    });
  }
}
