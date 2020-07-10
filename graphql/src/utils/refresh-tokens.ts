import { verify } from 'jsonwebtoken';
import { User } from '../entities/user';
import { createAccessToken, createRefreshToken } from './create-tokens';
import { RefreshTokenPayload } from '../types/tokens';

/** If refresh token is not expired, re-assign new access token and refresh token */
export const refreshTokens = async (
  refreshToken: string,
  accessTokenSecret: string,
  refreshTokenSecret: string
) => {
  let decodedRefreshToken;
  const guestPayload = {
    accessToken: null,
    refreshToken: null,
    user: null,
  };

  try {
    decodedRefreshToken = verify(
      refreshToken,
      refreshTokenSecret
    ) as RefreshTokenPayload;
  } catch (error) {
    return guestPayload;
  }

  const { userId, tokenVersion } = decodedRefreshToken;
  const user = await User.findOne(userId);

  // If user is not found or the refresh token version doesn't match, return guestPayload
  if (!user || user.tokenVersion !== parseInt(tokenVersion, 10)) {
    return guestPayload;
  }

  const updatedUser = await user.save();

  if (!updatedUser) {
    return guestPayload;
  }

  const newAccessToken = await createAccessToken(
    user.id,
    user.role,
    accessTokenSecret
  );

  return {
    accessToken: newAccessToken,
    user: updatedUser,
  };
};
