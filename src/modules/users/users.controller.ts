import { UserRolesDecorator } from '@app/modules/auth/decorators/role.decorator';
import { JwtGuard } from '@app/modules/auth/guard/jwt.guard';
import { RoleGuard } from '@app/modules/auth/guard/role.guard';
import { User } from '@app/modules/users/entities/user.entity';
import { UserRole } from '@app/modules/users/enums/role.enum';
import { UsersService } from '@app/modules/users/users.service';
import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';

@ApiTags('Users')
@ApiBearerAuth()
@Controller({ path: 'users', version: ['1'] })
@UseGuards(ThrottlerGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UserRolesDecorator(UserRole.ADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(JwtGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully fetched.',
    type: User, // Replace with your User entity or DTO
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. You do not have the required role.',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found.',
  })
  async find(@Param(':id') id: string) {
    return this.usersService.find(id);
  }
}
