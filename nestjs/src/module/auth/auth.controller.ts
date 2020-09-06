import {
  Controller,
  Post,
  Req,
  Body,
  BadRequestException,
  ForbiddenException,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/registerUser.dto';
import { LoginResponse } from './type/loginResponse';
import * as bcrypt from 'bcryptjs';
import { LoginUserDto } from './dto/loginUser.dto';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { CookieInterceptor } from './interceptor/cookie.interceptor';

@UseInterceptors(CookieInterceptor)
@Controller('/api/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('register')
  async registerUser(
    @Body() registerUserDto: RegisterUserDto,
  ): Promise<LoginResponse> {
    const { email, password, ...rest } = registerUserDto;

    const existingUser = await this.userService.findOneByEmail(email);

    if (existingUser) {
      throw new BadRequestException('User already exists.');
    }

    try {
      // Hash user password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create and save a new user entity in the database
      // If entity does not exist in the database then inserts, otherwise updates.
      const user = await this.userService.create({
        ...registerUserDto,
        password: hashedPassword,
      });
      const { id, role, tokenVersion } = user;
      const tokens = this.authService.assignTokens(id, role, tokenVersion);

      return tokens;
    } catch (error) {
      throw new BadRequestException('Failed to register user.');
    }
  }

  @Post('login')
  async loginUser(@Body() loginUserDto: LoginUserDto): Promise<LoginResponse> {
    const { email, password: loginPassword } = loginUserDto;
    let existingUser: Omit<User, 'createdAt' | 'updatedAt'>;
    let isValid: boolean;

    try {
      existingUser = await this.userService.findUserWithPassword(email);
      isValid = await bcrypt.compare(loginPassword, existingUser.password);
    } catch (error) {
      throw new ForbiddenException('Username or password is invalid');
    }

    if (!isValid) {
      throw new ForbiddenException('Username or password is invalid');
    }

    const { id, role, tokenVersion } = existingUser;
    const { password, ...user } = existingUser;

    const tokens = this.authService.assignTokens(id, role, tokenVersion);

    return tokens;
  }

  @Post('refresh-token')
  async getTokens(@Req() req): Promise<LoginResponse> {
    const token = req.cookies['refreshToken'];

    try {
      const {
        accessToken,
        refreshToken,
        user,
      } = await this.authService.refreshTokens(token);
      if (accessToken && user) {
        return { accessToken, refreshToken };
      }
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }
}
