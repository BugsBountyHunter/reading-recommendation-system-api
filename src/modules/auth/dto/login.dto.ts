import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, Length } from 'class-validator';
import { User } from '@app/modules/users/entities/user.entity';

export class LoginDto {
  @ApiProperty({ example: 'username123', description: 'User username' })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({ example: 'password123', description: 'User password' })
  @IsNotEmpty()
  @IsString()
  @Length(6, 20)
  password: string;

  @IsNotEmpty()
  @Type(() => User)
  user: User; // This is the user object that will be returned after login
}
