import { Router } from 'express';
import { HeritageController } from '../controllers/heritage.controller.js';

export const heritageRouter = Router();

heritageRouter.get('/', HeritageController.getAllHeritages);
heritageRouter.get('/:id', HeritageController.getHeritageById);
heritageRouter.post('/', HeritageController.createHeritage);
heritageRouter.put('/:id', HeritageController.updateHeritage);
heritageRouter.patch('/:id/submit', HeritageController.submitHeritage);
heritageRouter.patch('/:id/status', HeritageController.updateHeritageStatus);
heritageRouter.delete('/:id', HeritageController.deleteHeritage);
