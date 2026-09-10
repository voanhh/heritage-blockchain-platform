import { Request, Response } from 'express';
import { ExpertService } from '../services/expert.service.js';
import { AdminAssignExpertDto } from '../types/dto/expert.dto.js';

export class ExpertController {
  /**
   * POST /api/experts/admin/assign
   * Admin gán hoặc cập nhật Chuyên gia
   */
  static async adminAssignExpert(req: Request, res: Response) {
    try {
      const performerRole = (req as any).user.roles;
      const dto = req.body as AdminAssignExpertDto;

      const data = await ExpertService.assignOrUpdateExpertByAdmin({
        performerRole,
        dto,
      });

      return res.json({
        success: true,
        message: 'Đã bổ nhiệm / Cập nhật chức danh Chuyên gia thành công',
        data,
      });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  /**
   * DELETE /api/experts/admin/revoke/:targetUserId
   * Admin cắt chức / thu hồi quyền Chuyên gia
   */
  static async adminRevokeExpert(req: Request, res: Response) {
    try {
      const { targetUserId } = req.params;

      const result = await ExpertService.revokeExpertStatus(targetUserId as string);

      return res.json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }
}
