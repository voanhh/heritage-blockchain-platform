import type { NextFunction, Request, Response } from 'express';
import { UserRole } from '../types/rbac.js';

type RequestWithUser = Request & {
  user?: {
    id: string;
    role: UserRole;
  };
};

export function requireRole(roles: UserRole[]) {
  return (req: RequestWithUser, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication is required.' });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({ success: false, message: 'Insufficient permissions.' });
      return;
    }

    next();
  };
}

