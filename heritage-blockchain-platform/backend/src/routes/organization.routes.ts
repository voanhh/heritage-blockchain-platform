import { Router } from 'express';
import { OrganizationController } from '../controllers/organization.controller.js';
import { CreateOrganizationDto, UpdateOrgStatusDto } from '../types/dto/organization.dto.js';
import { validateDto } from '../middleware/validate.middleware.js';
import { AuthMiddleware } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/rbac.middleware.js';
import { UserRole } from '../types/enums/rbac.js';

const organizationRoute = Router();

// Endpoint: POST /organizations/request
organizationRoute.post(
  '/request',
  AuthMiddleware.authenticate, // Bắt buộc user phải đăng nhập
  validateDto(CreateOrganizationDto), // Chặn rác, kiểm tra email .gov.vn, .edu.vn
  OrganizationController.requestCreation
);

organizationRoute.get(
  '/pending',
  AuthMiddleware.authenticate,
  //requireRole(UserRole.SYSTEM_ADMIN),
  OrganizationController.getPendingRequests
);

// SYSTEM ADMIN: Phê duyệt hoặc Từ chối tổ chức theo ID
organizationRoute.patch(
  '/:id/status',
  AuthMiddleware.authenticate,
  //requireRole(UserRole.SYSTEM_ADMIN),
  validateDto(UpdateOrgStatusDto),
  OrganizationController.updateStatus
);
export default organizationRoute;
