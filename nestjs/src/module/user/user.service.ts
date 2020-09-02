import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { RegisterUserDto } from './dto/registerUser.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOneByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({
      where: { email },
    });
  }

  async findUserWithPassword(email: string): Promise<User> {
    return await this.userRepository.findOne({
      select: ['id', 'firstName', 'lastName', 'email', 'role', 'password'],
      where: { email },
    });
  }

  async findOneById(id: string): Promise<User> {
    return await this.userRepository.findOne({
      where: { id },
    });
  }

  async create(user: RegisterUserDto): Promise<User> {
    const newUser = await this.userRepository.create(user);
    return await this.userRepository.save(newUser);
  }
}
