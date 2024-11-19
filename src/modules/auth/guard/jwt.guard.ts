import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '@app/modules/users/users.service';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    try {
      const token = this.getToken(request);
      const decodedToken = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('auth.secret'),
        issuer: this.configService.get<string>('auth.issuer'),
        audience: this.configService.get<string>('auth.audience'),
      });

      const { sub: userId } = decodedToken;

      const foundUser = await this.userService.findOneById(userId);

      request['user'] = foundUser;
      return true;
    } catch (e) {
      throw new UnauthorizedException(e.message && 'Unauthorized');
    }
  }

  protected getToken(request: {
    headers: Record<string, string | string[]>;
  }): string {
    const authorization = request.headers['authorization'];

    if (!authorization || Array.isArray(authorization)) {
      throw new Error('Invalid Authorization Header');
    }
    const [, token] = authorization.split(' ');
    return token;
  }
}
