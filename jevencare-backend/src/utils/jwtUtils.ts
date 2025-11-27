import jwt, { SignOptions } from "jsonwebtoken";

export interface JWTPayload {
  userId: string;
  phone: string;
  role: string;
}

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;
const JWT_ACCESS_EXPIRE = process.env.JWT_ACCESS_EXPIRE || "15m";
const JWT_REFRESH_EXPIRE = process.env.JWT_REFRESH_EXPIRE || "7d";

const accessTokenOptions: SignOptions = {
  expiresIn: JWT_ACCESS_EXPIRE as any,
};

const refreshTokenOptions: SignOptions = {
  expiresIn: JWT_REFRESH_EXPIRE as any,
};

export const generateAccessToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, JWT_SECRET, accessTokenOptions);
};

export const generateRefreshToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, JWT_REFRESH_SECRET, refreshTokenOptions);
};

export const verifyAccessToken = (token: string): JWTPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch {
    return null;
  }
};

export const verifyRefreshToken = (token: string): JWTPayload | null => {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET) as JWTPayload;
  } catch {
    return null;
  }
};
