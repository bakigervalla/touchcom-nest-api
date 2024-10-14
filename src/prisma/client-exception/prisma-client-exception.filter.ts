import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const message = exception.message;

    switch (exception.code) {
      case 'P2002':
        response.status(HttpStatus.CONFLICT).json({
          statusCode: HttpStatus.CONFLICT,
          message,
        });
        break;
      case 'P1001':
        response.status(HttpStatus.BAD_GATEWAY).json({
          statusCode: HttpStatus.BAD_GATEWAY,
          message,
        });
        break;
      case 'P1002':
        response.status(HttpStatus.GATEWAY_TIMEOUT).json({
          statusCode: HttpStatus.GATEWAY_TIMEOUT,
          message,
        });
        break;
      case 'P1008':
        response.status(HttpStatus.REQUEST_TIMEOUT).json({
          statusCode: HttpStatus.REQUEST_TIMEOUT,
          message,
        });
        break;
      default:
        super.catch(exception, host);
    }
  }
}
