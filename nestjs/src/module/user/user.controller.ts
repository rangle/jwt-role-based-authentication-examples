import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { UserResponse } from './type/userResponse';
import { Roles } from '../auth/decorator/roles.decorator';

@Controller('/api/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Roles('admin', 'manager')
  async findAll(): Promise<User[]> {
    try {
      return await this.userService.findAll();
    } catch (error) {
      throw new NotFoundException(`Cannot find products`);
    }
  }

  @Get(':id')
  @Roles('admin', 'manager', 'customer')
  async findUserById(@Param('id') userId: string): Promise<UserResponse> {
    const id = parseInt(userId, 10);
    try {
      return await this.userService.findOneById(id);
    } catch (error) {
      throw new NotFoundException(`Cannot find user #${id}`);
    }
  }
}
