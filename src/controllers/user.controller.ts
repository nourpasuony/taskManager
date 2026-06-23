import type { Response } from "express";
import type { AuthRequest } from "../middlewares/auth.middleware.js";
import { asyncHandler } from "../middlewares/asyncHandler.middleware.js";
import { findUserByIdService } from "../services/user.service.js";
import { httpStatus } from "../config/http.config.js";

export const getCurrentUserConstoller = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user?._id;
    if (!userId) {
      throw new Error("User not authenticated");
    }

    const user = await findUserByIdService(userId);
    return res
      .status(httpStatus.OK)
      .json({ message: "Success to get user", user });
  }
);
