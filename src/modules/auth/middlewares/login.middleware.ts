import { TypedRequestBody } from '@app/common/interfaces/request-type.interface';
import { LoginDto } from '@app/modules/auth/dto/login.dto';
import { UsersService } from '@app/modules/users/users.service';
import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Response, NextFunction } from 'express';

@Injectable()
export class LoginMiddleware implements NestMiddleware {
  constructor(private readonly usersService: UsersService) {}

  async use(
    req: TypedRequestBody<LoginDto>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const user = await this.usersService.findOneByUsername(req.body.username);
      if (!user) {
        throw new BadRequestException('User not exist');
      }

      req.body.user = user;
      next();
    } catch (error) {
      throw error;
    }
  }
}
