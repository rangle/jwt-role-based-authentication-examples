import { Injectable, ForbiddenException } from '@nestjs/common';
import { sign, verify } from 'jsonwebtoken';
import { UserService } from '../user/user.service';
import { AccessTokenPayload, RefreshTokenPayload } from './type/jwtPayload';
import { UserRole } from '../user/user.entity';
import { UserResponse } from '../user/type/userResponse';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  createAccessToken({ userId, role }: AccessTokenPayload): string {
    return sign({ userId, role }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '15m',
    });
  }

  createRefreshToken({ userId, tokenVersion }: RefreshTokenPayload): string {
    return sign({ userId, tokenVersion }, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: '7d',
    });
  }

  assignTokens(userId: number, role: UserRole, tokenVersion: number) {
    return {
      accessToken: this.createAccessToken({ userId, role }),
      refreshToken: this.createRefreshToken({ userId, tokenVersion }),
    };
  }

  /** If refresh token is not expired, re-assign new access token and refresh token */
  async refreshTokens(refreshToken: string) {
    // let decodedRefreshToken: RefreshTokenPayload;
    // let user: UserResponse;

    const decodedRefreshToken = verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
    );
    const user = await this.userService.findOneById(decodedRefreshToken.userId);

    // If user is not found or the refresh token version doesn't match, throw error
    if (!user || user.tokenVersion !== decodedRefreshToken.tokenVersion) {
      throw new Error('Please register or sign in.');
    }

    const { id, role, tokenVersion } = user;

    const tokens = await this.assignTokens(id, role, tokenVersion);
    return {
      user,
      ...tokens,
    };
  }
}
