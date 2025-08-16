import { sign } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_TOKEN_SECRET as string;
const JWT_TOKEN_EXPIRE_TIME = Number(process.env.JWT_TOKEN_EXPIRE_TIME);
const JWT_REFRESH_TOKEN_EXPIRE_TIME = Number(process.env.JWT_REFRESH_TOKEN_EXPIRE_TIME);

export type TokenPayload = {
  userId: string;
  email: string;
};

export type TokenPair = {
  accessToken: string;
  refreshToken: string;
};

export function generateTokens(payload: TokenPayload): TokenPair {
  const accessToken = sign(payload, JWT_SECRET, { expiresIn: JWT_TOKEN_EXPIRE_TIME });
  const refreshToken = sign(payload, JWT_REFRESH_TOKEN_SECRET, { expiresIn: JWT_REFRESH_TOKEN_EXPIRE_TIME });

  return {
    accessToken,
    refreshToken,
  };
}
