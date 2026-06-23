import { httpStatus, HttpStatusCodeType } from "../config/http.config.js";
import { ErrorCodeEnum, ErrorCodeEnumType } from "../enums/error-code.enum.js";

export class AppError extends Error {
  public statusCode: HttpStatusCodeType;
  public errorCode?: ErrorCodeEnumType;

  constructor(
    message: string,
    statusCode = httpStatus.INTERNAL_SERVER_ERROR,
    errorCode: ErrorCodeEnumType
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

// export class HttpError extends AppError {
//   constructor(
//     message = "Http Error",
//     statusCode: HttpStatusCodeType,
//     errorCode?: ErrorCodeEnumType
//   ) {
//     super(message, statusCode, errorCode);
//   }
// }

export class NotFoundError extends AppError {
  constructor(message = "Resource Not Found", errorCode?: ErrorCodeEnumType) {
    super(
      message,
      httpStatus.NOT_FOUND,
      errorCode || ErrorCodeEnum.RESOURCE_NOT_FOUND
    );
  }
}

export class BadRequestError extends AppError {
  constructor(message = "Bad Request", errorCode?: ErrorCodeEnumType) {
    super(
      message,
      httpStatus.BAD_REQUEST,
      errorCode || ErrorCodeEnum.VALIDATION_ERROR
    );
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized", errorCode?: ErrorCodeEnumType) {
    super(
      message,
      httpStatus.UNAUTHORIZED,
      errorCode || ErrorCodeEnum.ACCESS_UNAUTHORIZED
    );
  }
}

export class InternalServerError extends AppError {
  constructor(
    message = "Internal Server Error",
    errorCode?: ErrorCodeEnumType
  ) {
    super(
      message,
      httpStatus.FORBIDDEN,
      errorCode || ErrorCodeEnum.INTERNAL_SERVER_ERROR
    );
  }
}
