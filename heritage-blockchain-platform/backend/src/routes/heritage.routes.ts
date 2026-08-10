import { Router } from 'express';
import { HeritageController } from '../controllers/heritage.controller.js';
import { requireRole } from '../middleware/rbac.middleware.js';
import { UserRole } from '../types/rbac.js';

export const heritageRouter = Router();
const controller = new HeritageController();

heritageRouter.get('/', controller.list);
heritageRouter.get('/:id', controller.detail);
heritageRouter.post('/', requireRole([UserRole.ADMIN, UserRole.DATA_PROVIDER]), controller.createPlaceholder);

