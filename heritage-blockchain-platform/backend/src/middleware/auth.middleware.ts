import { NextFunction, Request, Response } from "express";
import { TokenServices } from "../services/token.service.js";

export class AuthMiddleware {
  static authenticate(req: Request, res: Response, next: NextFunction) {
    const header = req.headers.authorization;

    if (!header?.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'NO_TOKEN_PROVIDED' });
    }

    const token = header.slice(7);
    try {
      const payload = TokenServices.verify(token);
      req.user = payload;
      next();
    } catch (error: any) {
      const message = error.name === 'TokenExpiredError'
        ? 'TOKEN_EXPIRED'
        : 'TOKEN_INVALID';
      return res.status(401).json({ message });
    }
  }


}
