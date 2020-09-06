import { Controller, Get, Post, Res, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { response } from 'express';

@Controller('/api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('refresh-token')
  async getTokens(@Res() res, @Req() req): Promise<any> {
    const token = req.cookies['refreshToken'];
    const {
      accessToken,
      refreshToken,
      user,
    } = await this.authService.refreshTokens(token);

    if (accessToken && user) {
      return res.send({ accessToken, user });
    } else {
      return res.send({
        accessToken: null,
        user: null,
      });
    }
  }
}
