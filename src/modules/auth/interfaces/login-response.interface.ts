import { UserResponse } from '@app/modules/users/dto/user-response.dto';

export interface LoginResponse {
  user: UserResponse;
  accessToken: string;
  expiresIn: number;
}
