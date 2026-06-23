import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import { Env } from "../config/env.config.js";

type TimeUnit = "s" | "m" | "h" | "d" | "w" | "M" | "y";
type TimeString = `${number}${TimeUnit}`;

export type AccessTokenPayload = {
  userId: string;
};

type signOptionsAndSecret = SignOptions & {
  secret: string;
  expiresIn?: TimeString | number;
};

const defaults: SignOptions = {
  audience: ["user"],
};

const accessTokenSignOptions: signOptionsAndSecret = {
  secret: Env.JWT_SECRET,
  expiresIn: Env.JWT_EXPIRES_IN as TimeString,
};

export const signAccessToken = (
  payload: AccessTokenPayload,
  options?: signOptionsAndSecret
) => {
  const isAccessToken = !options || options === accessTokenSignOptions;
  const { secret, ...rest } = options || accessTokenSignOptions;
  const token = jwt.sign(payload, secret, {
    ...defaults,
    ...rest,
  });
  const expiresAt = isAccessToken
    ? (jwt.decode(token) as JwtPayload)?.exp! * 1000
    : undefined;
  return { token, expiresAt };
};
