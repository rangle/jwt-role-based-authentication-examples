import { verify } from 'jsonwebtoken';
import { Request } from 'express';
import { UserRole } from '../users/types/user-role';

export interface JtwTokenPayload {
  userId: string;
  role: UserRole;
}

export const verifyToken = (req: Request, secret: string) => {
  const bearerHeader = req.headers.authorization;
  if (bearerHeader) {
    const accessToken = bearerHeader.split(' ')[1];
    return verify(accessToken, secret) as JtwTokenPayload;
  } else {
    return {
      userId: null,
      role: UserRole.GUEST,
    };
  }
};
