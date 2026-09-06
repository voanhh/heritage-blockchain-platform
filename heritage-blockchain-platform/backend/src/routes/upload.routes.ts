import { Router } from 'express';
import { UploadController } from '../controllers/upload.controller.js';
import { upload } from '../middleware/upload.middleware.js';
import { AuthMiddleware } from '../middleware/auth.middleware.js';

const uploadRouter = Router();

// Endpoint: POST /api/upload/document
// Yêu cầu FE gửi form-data với field tên là "file"
uploadRouter.post(
  '/document',
  AuthMiddleware.authenticate,
  upload.single('file'),
  UploadController.uploadDocument
);

uploadRouter.post(
  '/documents',
  AuthMiddleware.authenticate,
  upload.array('files', 3), // Bắt Multer chỉ cho phép tối đa 3 files
  UploadController.uploadMultipleDocuments
);

export default uploadRouter;
