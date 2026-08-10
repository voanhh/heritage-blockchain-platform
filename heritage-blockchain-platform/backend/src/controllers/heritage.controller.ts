import type { NextFunction, Request, Response } from 'express';
import { HeritageService } from '../services/heritage.service.js';

const heritageService = new HeritageService();

export class HeritageController {
  async list(_req: Request, res: Response, next: NextFunction) {
    try {
      const data = await heritageService.listHeritages();
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async detail(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await heritageService.getHeritage(String(req.params.id));
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async createPlaceholder(_req: Request, res: Response) {
    res.status(501).json({
      success: false,
      message: 'Heritage CRUD will be implemented after Phase 1 foundation.'
    });
  }
}
