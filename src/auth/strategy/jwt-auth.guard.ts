import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor() {
    super({
      passReqToCallback: true,
    });
  }

  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(error, user) {
    if (error || !user) {
      throw error || new UnauthorizedException();
    }
    return user;
  }
}
