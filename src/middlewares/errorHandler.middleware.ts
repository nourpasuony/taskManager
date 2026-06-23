import { z, ZodError } from "zod";
import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { httpStatus } from "../config/http.config.js";
import { AppError } from "../utiles/app-error.js";
import { ErrorCodeEnum } from "../enums/error-code.enum.js";

const formatZodError = (res: Response, error: z.ZodError) => {
  const errors = error?.issues?.map((err) => ({
    field: err.path.join("."),
    message: err.message,
  }));
  return res.status(httpStatus.BAD_REQUEST).json({
    message: "Validation failed",
    errors: errors,
    errorCode: ErrorCodeEnum.VALIDATION_ERROR,
  });
};

export const errorHandler: ErrorRequestHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): any => {
  console.log(`Error occurred on PATH: ${req.path} - MESSAGE: ${err}`);

  if (err instanceof ZodError) {
    return formatZodError(res, err);
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message,
      errorCode: err.errorCode,
    });
  }

  return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
    message: "Internal Server Error",
    error: err?.message || "An unexpected error occurred",
  });
};
