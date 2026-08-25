import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { validateDto } from '../middleware/validate.middleware.js';
import { RegisterDto } from '../types/dto/auth.dto.js';
import { AuthMiddleware } from '../middleware/auth.middleware.js';

export const authRouter = Router();

authRouter.post('/login', AuthController.login);
authRouter.post('/register', validateDto(RegisterDto), AuthController.register);
authRouter.post('/refresh', AuthController.refresh);
authRouter.post('/logout', AuthMiddleware.authenticate, AuthController.logout);
authRouter.post('/logout-all', AuthMiddleware.authenticate, AuthController.logoutAll);
