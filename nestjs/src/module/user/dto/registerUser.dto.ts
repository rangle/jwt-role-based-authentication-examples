import { UserRole } from '../user.entity';

export class RegisterUserDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
}
