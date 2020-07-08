import { sign } from 'jsonwebtoken';

export const createAccessToken = (
  userId: number,
  role: string,
  secret: string
) => {
  return sign({ userId, role }, secret, { expiresIn: '15m' });
};

export const createRefreshToken = (
  userId: number,
  tokenVersion: number,
  secret: string
) => {
  return sign({ userId }, secret, { expiresIn: '7d' });
};
