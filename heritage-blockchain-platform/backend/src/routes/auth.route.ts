import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { validateDto } from "../middleware/validate.middleware.js";
import { RegisterDto } from "../types/dto/auth.dto.js";

const authRoute = Router();

authRoute.post('/login', AuthController.login);
authRoute.post('/register', validateDto(RegisterDto), AuthController.register);
authRoute.post('/refresh', AuthController.refresh);

export default authRoute;
