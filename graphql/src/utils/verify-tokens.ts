import { verify } from 'jsonwebtoken';
import { Request } from 'express';
import { UserRole } from '../users/types/user-role';
import { AccessTokenPayload } from '../types/tokens';

export const verifyAccessToken = async (req: Request, accessSecret: string) => {
  const bearerHeader = req.headers.authorization;

  let guestPayload = {
    userId: null,
    role: UserRole.GUEST,
  };

  if (!bearerHeader) {
    return guestPayload;
  }

  const accessToken = bearerHeader.split(' ')[1];

  const decodedToken = verify(accessToken, accessSecret) as AccessTokenPayload;

  if (decodedToken) {
    return {
      userId: decodedToken?.userId,
      role: decodedToken?.role,
    };
  } else {
    return guestPayload;
  }
};
