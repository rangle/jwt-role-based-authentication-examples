import * as bcrypt from 'bcryptjs';
import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Body,
  BadRequestException,
  ForbiddenException,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { RegisterUserDto } from './dto/registerUser.dto';
import { LoginUserDto } from './dto/loginUser.dto';
import { LoginResponse } from './type/loginResponse';
import { AuthService } from '../auth/auth.service';
import { UserResponse } from './type/userResponse';

@Controller('/api/users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  async findAll(): Promise<User[]> {
    try {
      return this.userService.findAll();
    } catch (error) {
      throw new NotFoundException(`Cannot find products`);
    }
  }

  @Get(':id')
  async findUserById(@Param('id') id: string): Promise<User> {
    try {
      return await this.userService.findOneById(id);
    } catch (error) {
      throw new NotFoundException(`Cannot find user #${id}`);
    }
  }

  @Post('register')
  async registerUser(
    @Body() registerUserDto: RegisterUserDto,
    @Res() res,
  ): Promise<LoginResponse> {
    const { firstName, lastName, email, password } = registerUserDto;

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
      const { accessToken, refreshToken } = this.authService.assignTokens(
        id,
        role,
        tokenVersion,
      );

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days - express accepts token maxAge in ms, therefore multiply by 1000
        path: '/api/auth/refresh-token', // attach the refreshToken only to this endpoint
      });

      const response = {
        user,
        accessToken,
      };

      // Using express response to ensure we can use @Res
      return res.status(HttpStatus.OK).json(response);
    } catch (error) {
      throw new BadRequestException('Failed to register user.');
    }
  }

  @Post('login')
  async loginUser(
    @Body() loginUserDto: LoginUserDto,
    @Res() res,
  ): Promise<LoginResponse> {
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

    const { accessToken, refreshToken } = this.authService.assignTokens(
      id,
      role,
      tokenVersion,
    );

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days - express accepts token maxAge in ms, therefore multiply by 1000
      path: '/api/auth/refresh-token', // attach the refreshToken only to this endpoint
    });

    const response = {
      user,
      accessToken,
    };
    // Using express response to ensure we can use @Res
    return res.status(HttpStatus.OK).json(response);
  }
}
