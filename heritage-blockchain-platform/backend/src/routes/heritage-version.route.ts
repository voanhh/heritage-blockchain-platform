// heritage-version.route.ts

import { Router } from 'express';
import { HeritageVersionController } from '../controllers/heritage-version.controller.js';
// import auth middleware của project bạn
// import role middleware nếu bạn có

const router = Router();

router.post(
  '/:heritageId/publish',
  // authenticate,
  // requireRole('ADMIN'),
  HeritageVersionController.publish
);

export default router;
