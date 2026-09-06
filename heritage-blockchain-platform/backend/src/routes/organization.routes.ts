import { Router } from 'express';
import { OrganizationController } from '../controllers/organization.controller.js';
import { CreateOrganizationDto } from '../types/dto/create-organization.dto.js';
import { validateDto } from '../middleware/validate.middleware.js';
import { AuthMiddleware } from '../middleware/auth.middleware.js';

const organizationRoute = Router();

// Endpoint: POST /organizations/request
organizationRoute.post(
  '/request',
  AuthMiddleware.authenticate, // Bắt buộc user phải đăng nhập
  validateDto(CreateOrganizationDto), // Chặn rác, kiểm tra email .gov.vn, .edu.vn
  OrganizationController.requestCreation
);

export default organizationRoute;
