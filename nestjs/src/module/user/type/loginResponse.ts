import { UserResponse } from './userResponse';

export interface LoginResponse {
  user: UserResponse;
  accessToken: string;
}
