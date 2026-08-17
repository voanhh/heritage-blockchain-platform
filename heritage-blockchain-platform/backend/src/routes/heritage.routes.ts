import { Router } from 'express';
import { HeritageController } from '../controllers/heritage.controller.js';

const router = Router();

router.get('/', HeritageController.getAllHeritages);
router.get('/:id', HeritageController.getHeritageById);
router.post('/', HeritageController.createHeritage);
router.put('/:id', HeritageController.updateHeritage);
router.delete('/:id', HeritageController.deleteHeritage);

export default router;