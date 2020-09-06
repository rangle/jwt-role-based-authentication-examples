import { UserRole } from '../../user/user.entity';

export class RegisterUserDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
}
