import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';

import { PrismaService } from '@~prisma/prisma.service';

@Injectable()
export class EmailInterceptor implements NestInterceptor {
  constructor(private readonly prisma: PrismaService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const { id } = request.params;
    const { email } = request.body;

    const user = await this.prisma.user.findFirst({
      where: {
        email,
        ...(id
          ? {
              NOT: { id: parseInt(id, 10) },
            }
          : {}),
      },
    });

    if (user) {
      throw new HttpException('Invalid request', HttpStatus.BAD_REQUEST);
    }

    return next.handle();
  }
}
