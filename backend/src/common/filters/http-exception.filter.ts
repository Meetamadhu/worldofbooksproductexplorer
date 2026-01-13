import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let error = 'Internal Server Error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      if (typeof exceptionResponse === 'object') {
        const responseObject = exceptionResponse as any;
        message = responseObject.message || exception.message;
        error = responseObject.error || 'Error';
      } else {
        message = exception.message;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      error = exception.name;
    }

    this.logger.error(
      `Exception caught: ${status} ${error}`,
      exception instanceof Error ? exception.stack : String(exception),
    );

    response.status(status).json({
      statusCode: status,
      error,
      message,
      timestamp: new Date().toISOString(),
    });
  }
}
