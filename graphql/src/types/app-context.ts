import { UserRole } from '../users/types/user-role';

export interface AppContext {
  userId: string;
  role: UserRole;
  req: Request;
  res: Response;
}
