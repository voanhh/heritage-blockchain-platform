import type { Request, Response } from 'express';

export class BlockchainController {
  listRecords(_req: Request, res: Response) {
    res.json({
      success: true,
      data: [],
      message: 'Blockchain record listing will be implemented in a later phase.'
    });
  }
}

