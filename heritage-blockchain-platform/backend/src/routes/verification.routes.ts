import { Router } from 'express';
import { VerificationController } from '../controllers/verification.controller.js';

export const verificationRouter = Router();

verificationRouter.get('/', VerificationController.getAllVerifications);
verificationRouter.get('/:id', VerificationController.getVerificationById);
verificationRouter.post('/:heritageId/start-review', VerificationController.startReview);
verificationRouter.post('/:heritageId/approve', VerificationController.approveHeritage);
verificationRouter.post('/:heritageId/reject', VerificationController.rejectHeritage);
