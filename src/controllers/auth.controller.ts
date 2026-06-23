import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware.js";
import { httpStatus } from "../config/http.config.js";
import { loginSchema, registerSchema } from "../validations/auth.validator.js";
import { loginService, registerService } from "../services/auth.service.js";

export const RegisterController = asyncHandler(
  async (req: Request, res: Response) => {
    const body = registerSchema.parse(req.body);
    const { user } = await registerService(body);

    return res
      .status(httpStatus.CREATED)
      .json({ message: "User registered successfully", user });
  }
);

export const loginController = asyncHandler(
  async (req: Request, res: Response) => {
    const body = loginSchema.parse(req.body);
    const { user, accessToken, expiresAt } = await loginService(body);
    return res.status(httpStatus.OK).json({
      message: "User logged in successfully",
      user,
      accessToken,
      expiresAt,
    });
  }
);
