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
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { RegisterUserDto } from './dto/registerUser.dto';
import { LoginUserDto } from './dto/loginUser.dto';
import { LoginResponse } from './type/loginResponse';

@Controller('/api/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(): Promise<User[]> {
    try {
      return this.userService.findAll();
    } catch (error) {
      throw new NotFoundException(`Cannot find products`);
    }
  }

  @Get(':id')
  async findUserById(@Param() params): Promise<User> {
    const { id } = params;
    try {
      return await this.userService.findOneById(id);
    } catch (error) {
      throw new NotFoundException(`Cannot find user #${id}`);
    }
  }

  @Post('register')
  async registerUser(@Body() registerUserDto: RegisterUserDto): Promise<User> {
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
      return await this.userService.create({
        ...registerUserDto,
        password: hashedPassword,
      });
    } catch (error) {
      throw new BadRequestException('Failed to register user.');
    }
  }

  @Post('login')
  async loginUser(@Body() loginUserDto: LoginUserDto): Promise<LoginResponse> {
    const { email, password: loginPassword } = loginUserDto;
    let existingUser;
    let isValid;

    try {
      existingUser = await this.userService.findUserWithPassword(email);
      isValid = await bcrypt.compare(loginPassword, existingUser.password);
    } catch (error) {
      throw new ForbiddenException('Username or password is invalid');
    }

    if (!isValid) {
      throw new ForbiddenException('Username or password is invalid');
    }

    const { password, ...user } = existingUser;

    return user;
  }
}
