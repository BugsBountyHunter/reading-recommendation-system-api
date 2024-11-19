import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsString, Length } from 'class-validator';
import { UserRole } from '@app/modules/users/enums/role.enum';

export class CreateUserDto {
  @ApiProperty({
    example: 'username123',
    required: true,
    nullable: false,
    description: 'User username',
  })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({
    example: 'password123',
    required: true,
    nullable: false,
    description: 'User password',
  })
  @IsNotEmpty()
  @IsString()
  @Length(6, 20)
  password: string;

  @ApiProperty({
    example: UserRole.USER,
    required: true,
    nullable: false,
    enum: UserRole,
    description: 'User role',
  })
  @IsNotEmpty()
  @Transform(({ value }) => value.toUpperCase())
  @IsEnum(UserRole)
  role: UserRole;
}
