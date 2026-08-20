import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { validateDto } from "../middleware/validate.middleware.js";
import { RegisterDto } from "../types/dto/auth.dto.js";
import { AuthMiddleware } from "../middleware/auth.middleware.js";

const authRoute = Router();

authRoute.post('/login', AuthController.login);
authRoute.post('/register', validateDto(RegisterDto), AuthController.register);
authRoute.post('/refresh', AuthMiddleware.authenticate, AuthController.refresh);
authRoute.post('/logout', AuthMiddleware.authenticate, AuthController.logout);
authRoute.post('/logout-all', AuthMiddleware.authenticate, AuthController.logoutAll);
export default authRoute;
