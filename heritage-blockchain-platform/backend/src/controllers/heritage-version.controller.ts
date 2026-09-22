import { Request, Response, NextFunction } from 'express';
import { HeritageVersionService } from '../services/heritage-version.service.js';

export class HeritageVersionController {
  static async publish(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { heritageId } = req.params;

      const adminId = req.user?.sub;

      const version = await HeritageVersionService.publish(
        heritageId as string,
        adminId as string
      );

      return res.status(201).json({
        message: 'Publish Heritage thành công',
        data: version,
      });
    } catch (error) {
      next(error);
    }
  }
}
