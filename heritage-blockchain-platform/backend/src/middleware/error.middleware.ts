import type { NextFunction, Request, Response } from 'express';

export function errorMiddleware(error: Error, _req: Request, res: Response, _next: NextFunction) {
  void _next;

  res.status(500).json({
    success: false,
    message: error.message
  });
}
