import { Resolver, Query, Mutation, Arg } from 'type-graphql';
import * as bcrypt from 'bcryptjs';
import { User } from '../entities/user';
import { RegisterInput } from './types/register-input';

@Resolver()
export class UserResolver {
  // Get user by Id
  @Query(() => User)
  async user(@Arg('id') id: number) {
    const selectedUser = await User.findOne(id);
    return selectedUser || new Error('User not found.');
  }

  // Get all users
  @Query(() => [User])
  async allUsers() {
    const allUsers = await User.find();
    return allUsers || new Error('No user found.');
  }

  // Register a new user
  @Mutation(() => User)
  async registerUser(
    @Arg('user') { firstName, lastName, email, password, role }: RegisterInput
  ): Promise<User> {
    // Hash user password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create and save a new user entity in the database
    // If entity does not exist in the database then inserts, otherwise updates.
    const user = await User.create({
      firstName,
      lastName,
      email,
      role,
      password: hashedPassword,
    }).save();

    return user || new Error('Failed to create user.');
  }
}
