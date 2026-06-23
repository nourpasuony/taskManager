import type { NextFunction, Response } from "express";
import type { AuthRequest } from "./auth.middleware.js";
import type { RoleType } from "../enums/role.enum.js";
import { UnauthorizedError } from "../utiles/app-error.js";

export const authorize = (allowedRoles: RoleType[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new UnauthorizedError("User not authenticated");
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new UnauthorizedError(
        `Access denied. Required roles: ${allowedRoles.join(", ")}`
      );
    }

    next();
  };
};
