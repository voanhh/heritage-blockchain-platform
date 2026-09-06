import { Request, Response } from 'express';
import { OrganizationService } from '../services/organization.service.js';

export class OrganizationController {
  static async requestCreation(req: Request, res: Response) {
    try {
      const userId = req.user!.sub; // Giả sử bạn đã có middleware authenticate gán req.user

      if (!userId) {
        res.status(401).json({ message: 'UNAUTHORIZED' });
        return;
      }

      const dto = req.body;

      const result = await OrganizationService.createOrganizationRequest(userId, dto);

      return res.status(201).json({
        success: true,
        message: 'Gửi yêu cầu tạo tổ chức thành công. Vui lòng chờ System Admin phê duyệt.',
        data: result
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || 'Lỗi khi gửi yêu cầu'
      });
    }
  }
}
