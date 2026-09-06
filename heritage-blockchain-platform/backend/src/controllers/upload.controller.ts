import { Request, Response } from 'express';
import { UploadService } from '../services/upload.service.js';

export class UploadController {
  static async uploadDocument(req: Request, res: Response): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({ success: false, message: 'Không tìm thấy file' });
        return;
      }

      // Đẩy buffer xuống Service xử lý
      const fileUrl = await UploadService.uploadDocument(req.file.buffer);

      res.status(200).json({
        success: true,
        data: { url: fileUrl }
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async uploadMultipleDocuments(req: Request, res: Response): Promise<void> {
    try {
      const files = req.files as Express.Multer.File[];

      if (!files || files.length === 0) {
        res.status(400).json({ success: false, message: 'Không tìm thấy files' });
        return;
      }

      const fileUrls = await UploadService.uploadMultipleDocuments(files);

      res.status(200).json({
        success: true,
        data: { urls: fileUrls } // Trả về mảng ['url1', 'url2', 'url3']
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
