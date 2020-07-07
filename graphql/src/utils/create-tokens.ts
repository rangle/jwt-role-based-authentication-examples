import { sign } from 'jsonwebtoken';

export const createAccessToken = (userId: number, role: string) => {
  return sign({ userId, role }, 'accesstokensecret', { expiresIn: '15m' });
};
