import { TypedRequestBody } from '@app/common/interfaces/request-type.interface';
import { RegisterDto } from '@app/modules/auth/dto/register.dto';
import { UsersService } from '@app/modules/users/users.service';
import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction } from 'express';

@Injectable()
export class RegisterMiddleware implements NestMiddleware {
  constructor(private readonly userService: UsersService) {}

  async use(
    req: TypedRequestBody<RegisterDto>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const user = await this.userService.findOneByUsername(req.body.username);

      if (user) {
        throw new BadRequestException('User already exist');
      }

      next();
    } catch (error) {
      throw error;
    }
  }
}
