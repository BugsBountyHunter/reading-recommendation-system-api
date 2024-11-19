import { generateHashPassword } from '@app/common/utils/hash-password.utils';
import { IResponse } from '@app/common/utils/iresponse';
import { LoginDto } from '@app/modules/auth/dto/login.dto';
import { RegisterDto } from '@app/modules/auth/dto/register.dto';
import { LoginResponse } from '@app/modules/auth/interfaces/login-response.interface';
import { LoginResponse as RegisterResponse } from '@app/modules/auth/interfaces/login-response.interface';
import { UserResponse } from '@app/modules/users/dto/user-response.dto';
import { UsersService } from '@app/modules/users/users.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
  ) {}

  /**
   * This's login method help in login user
   * @param {LoginDto} loginDto
   * @returns {Promise<IResponse<LoginResponse>>}
   */
  async login({
    password,
    ...loginDto
  }: LoginDto): Promise<IResponse<LoginResponse>> {
    try {
      const salt = this.configService.get('auth.salt');
      const expiresIn = this.configService.get('auth.expiresIn');
      const hashedPassword = generateHashPassword(password, salt);
      const passwordMatch = hashedPassword === loginDto.user.password;
      if (!passwordMatch) {
        throw new BadRequestException('Invalid Credentials');
      }
      return <IResponse<LoginResponse>>{
        data: {
          user: plainToInstance(UserResponse, loginDto.user),
          accessToken: await this.generateToken(loginDto.user.id),
          expiresIn,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * This's register method help in register user
   * @param {RegisterDto} registerDto
   * @returns {Promise<IResponse<RegisterResponse>>}
   */
  async register(
    registerDto: RegisterDto,
  ): Promise<IResponse<RegisterResponse>> {
    try {
      const expiresIn = this.configService.get('auth.expiresIn');

      const createdUser = await this.userService.create(registerDto);
      return <IResponse<RegisterResponse>>{
        user: plainToInstance(UserResponse, createdUser),
        accessToken: await this.generateToken(createdUser.id),
        expiresIn,
        message: 'Successfully Create User',
      };
    } catch (error) {
      throw error;
    }
  }
  /**
   * This's generateToken method help in generate token
   * @param {string} id
   * @returns {Promise<string>}
   */
  async generateToken(id: string): Promise<string> {
    return this.jwtService.signAsync({ sub: id });
  }
}
