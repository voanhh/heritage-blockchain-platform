import { Router } from 'express';
import { BlockchainController } from '../controllers/blockchain.controller.js';

export const blockchainRouter = Router();
const controller = new BlockchainController();

blockchainRouter.get('/', controller.listRecords);

