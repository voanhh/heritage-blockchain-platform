import type { Request, Response } from 'express';

export class HealthController {
  getHealth(_req: Request, res: Response) {
    res.json({
      success: true,
      message: 'Heritage Blockchain API is running'
    });
  }
}

