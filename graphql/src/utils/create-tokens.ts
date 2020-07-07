import { sign } from 'jsonwebtoken';

export const createAccessToken = (
  userId: number,
  role: string,
  secret: string
) => {
  return sign({ userId, role }, secret, { expiresIn: '15m' });
};
