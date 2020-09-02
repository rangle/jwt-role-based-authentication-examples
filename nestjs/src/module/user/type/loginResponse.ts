import { UserRole } from '../user.entity';

export class LoginResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
}
