import { Injectable } from '@nestjs/common';
import { sign, verify } from 'jsonwebtoken';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  createAccessToken(userId: number, role: string): string {
    return sign({ userId, role }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '15m',
    });
  }

  createRefreshToken(userId: number, tokenVersion: number): string {
    return sign({ userId, tokenVersion }, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: '7d',
    });
  }

  assignTokens(userId: number, role: string, tokenVersion: number) {
    return {
      accessToken: this.createAccessToken(userId, role),
      refreshToken: this.createRefreshToken(userId, tokenVersion),
    };
  }

  /** If refresh token is not expired, re-assign new access token and refresh token */
  async refreshTokens(refreshToken: string) {
    let decodedRefreshToken;

    try {
      decodedRefreshToken = verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
      );
    } catch (error) {
      return;
    }

    const { userId: id, tokenVersion } = decodedRefreshToken;
    const user = await this.userService.findOneById(id);

    // If user is not found or the refresh token version doesn't match, return guestPayload
    if (!user || user.tokenVersion !== parseInt(tokenVersion, 10)) {
      return;
    }

    const {
      accessToken,
      refreshToken: newRefreshToken,
    } = await this.assignTokens(user.id, user.role, user.tokenVersion);

    return {
      accessToken,
      refreshToken: newRefreshToken,
      user,
    };
  }
}
