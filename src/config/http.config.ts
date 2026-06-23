
export const httpConfig = ()=> ({
    OK: 200,
    CREATED: 201,
    ACCEPTED: 202,
    NO_CONTENT: 204,
    // Client Errors
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    METHOD_NOT_ALLOWED: 405,
    CONFLICT: 409,
    UNSUPPORTED_MEDIA_TYPE: 415,
    UNPROCESSABLE_ENTITY: 422,
    TOO_MANY_REQUESTS: 429,
    // Server Errors
    INTERNAL_SERVER_ERROR: 500,
    NOT_IMPLEMENTED: 501,
    BAD_GATEWAY: 502,
    SERVICE_UNAVAILABLE: 503,
    GATEWAY_TIMEOUT: 504,
});


export const httpStatus = httpConfig();

export type HttpStatusCodeType = (typeof httpStatus)[keyof typeof httpStatus];


// Utility function to send standardized HTTP responses )(i will use it when the project grows)
// import { Response } from 'express';
// export const sendResponse = (res: Response, statusCode: number, message: string, data: any = null) => {
//     res.status(statusCode).json({
//         status: statusCode,
//         message,
//         data,
//     });
// };