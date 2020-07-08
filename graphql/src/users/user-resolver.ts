import { Resolver, Query, Mutation, Arg, Ctx } from 'type-graphql';
import * as bcrypt from 'bcryptjs';
import { User } from '../entities/user';
import { RegisterInput } from './types/register-input';
import { ApolloError, AuthenticationError } from 'apollo-server-express';
import { LoginResponse } from './types/login-response';
import { LoginInput } from './types/login-input';
import { createAccessToken, createRefreshToken } from '../utils/create-tokens';
import { ExpressContext } from 'apollo-server-express/dist/ApolloServer';

@Resolver()
export class UserResolver {
  @Query(() => User)
  async user(@Arg('id') id: number) {
    const selectedUser = await User.findOne(id);
    if (!selectedUser) {
      throw new ApolloError('User not found.', 'NOT FOUND');
    }
    return selectedUser;
  }

  @Query(() => [User])
  async allUsers() {
    const allUsers = await User.find();
    if (!allUsers) {
      throw new ApolloError('No user found.', 'NOT FOUND');
    }
    return allUsers;
  }

  @Mutation(() => User)
  async registerUser(
    @Arg('user') { firstName, lastName, email, password, role }: RegisterInput
  ): Promise<User> {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ApolloError('User already exists.', 'RESOURCE EXISTS');
    }
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

    if (!user || !hashedPassword) {
      throw new ApolloError('Failed to create user.', 'FAILED TO CREATE');
    }
    return user;
  }

  @Mutation(() => LoginResponse)
  async loginUser(
    @Arg('input') { email, password }: LoginInput,
    @Ctx() ctx: ExpressContext
  ): Promise<LoginResponse> {
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      throw new AuthenticationError('Username or password is invalid');
    }

    const isValid = await bcrypt.compare(password, existingUser.password);

    if (!isValid) {
      throw new AuthenticationError('Username or password is invalid');
    }

    const { id, role, tokenVersion } = existingUser;

    const accessToken = createAccessToken(
      id,
      role,
      <string>process.env.ACCESS_TOKEN_SECRET
    );

    const refreshToken = createRefreshToken(
      id,
      tokenVersion,
      <string>process.env.REFRESH_TOKEN_SECRET
    );

    ctx.res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days - express accepts token maxAge in ms, therefore multiply by 1000
      // path: '/refresh_token', // attach the refreshToken only to this endpoint
    });

    return {
      user: existingUser,
      accessToken,
    };
  }
}
