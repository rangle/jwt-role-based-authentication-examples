import { User } from '../user.entity';

export type UserResponse = Omit<User, 'createdAt' | 'updatedAt' | 'password'>;
