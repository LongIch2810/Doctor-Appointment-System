import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (response.headersSent) {
      return;
    }

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let code = 'INTERNAL_SERVER_ERROR';
    let details: string | string[] = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();

      if (typeof res === 'string') {
        details = res;
      } else if (typeof res === 'object' && res !== null) {
        const obj = res as any;

        if (Array.isArray(obj.message) && status === 400) {
          code = 'VALIDATION_FAILED';
          details = obj.message;
        } else {
          code = obj.code || HttpStatus[status] || 'UNKNOWN_ERROR';
          details = obj.message || obj.error || 'Bad request';
        }
      }
    }

    response.status(status).json({
      statusCode: status,
      success: false,
      data: null,
      error: {
        code,
        details,
      },
    });
  }
}
