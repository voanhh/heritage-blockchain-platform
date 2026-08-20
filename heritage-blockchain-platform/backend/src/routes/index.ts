import { Router } from 'express';
import { blockchainRouter } from './blockchain.routes.js';
import { healthRouter } from './health.routes.js';
//import { heritageRouter } from './heritage.routes.js';//x
import authRoute from './auth.route.js';

export const apiRouter = Router();

apiRouter.use('/health', healthRouter);
//apiRouter.use('/heritages', heritageRouter);
apiRouter.use('/blockchain-records', blockchainRouter);
apiRouter.use('/auth', authRoute);

