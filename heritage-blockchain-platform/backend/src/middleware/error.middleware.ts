import type { NextFunction, Request, Response } from 'express';

const authErrorStatus: Record<string, number> = {
  INVALID_CREDENTIALS: 401,
  INVALID_OR_EXPIRED_TOKEN: 401,
  YOUR_REFRESH_TOKEN_INVALID: 401,
  REFRESH_TOKEN_REUSE_DETECTED: 401,
  REFRESH_TOKEN_EXPIRED: 401,
  EMAIL_IS_ALREADY_IN_USE: 409,
  JWT_SECRET_IS_REQUIRED: 500
};

export function errorMiddleware(error: Error, _req: Request, res: Response, _next: NextFunction) {
  void _next;

  const normalizedMessage = error.message.replace(/!$/, '');
  const status = authErrorStatus[normalizedMessage] ?? 500;

  res.status(status).json({
    success: false,
    message: normalizedMessage
  });
}
