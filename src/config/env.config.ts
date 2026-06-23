import { getEnv } from "../utiles/get-Env.js";

const envConfig = () => ({
  NODE_ENV: getEnv("NODE_ENV", "development"),
  PORT: getEnv("PORT", "3000"),
  BASE_PATH: getEnv("BASE_PATH", "/api"),
  MONGO_URI: getEnv("MONGO_URI"),
  JWT_SECRET: getEnv("JWT_SECRET", "your_jwt_secret_key"),
  JWT_EXPIRES_IN: getEnv("JWT_EXPIRES_IN", "7d") as string,
  JWT_REFRESH_SECRET: getEnv(
    "JWT_REFRESH_SECRET",
    "your_jwt_refresh_secret_key"
  ),
  JWT_REFRESH_EXPIRES_IN: getEnv("JWT_REFRESH_EXPIRES_IN", "30d") as string,

  FRONTEND_ORIGIN: getEnv("FRONTEND_ORIGIN", "localhost"),
});

export const Env = envConfig();
