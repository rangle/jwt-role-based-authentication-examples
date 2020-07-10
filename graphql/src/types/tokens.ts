import { UserRole } from '../users/types/user-role';

export interface AccessTokenPayload {
  userId: string;
  role: UserRole;
}

export interface RefreshTokenPayload {
  userId: string;
  tokenVersion: string;
}
