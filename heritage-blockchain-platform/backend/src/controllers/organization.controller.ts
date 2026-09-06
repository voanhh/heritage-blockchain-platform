import { Request, Response } from 'express';
import { OrganizationService } from '../services/organization.service.js';

export class OrganizationController {
  //organization/request
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

  //organization/pending
  static async getPendingRequests(req: Request, res: Response) {
    try {
      const data = await OrganizationService.getPendingOrganizations();
      return res.status(200).json({ success: true, data });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  //organization/status
  static async updateStatus(req: Request, res: Response) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const dto = req.body;

      const result = await OrganizationService.updateOrganizationStatus(id, dto);

      return res.status(200).json({
        success: true,
        message: `Đã ${dto.status === 'APPROVED' ? 'phê duyệt' : 'từ chối'} tổ chức thành công`,
        data: result
      });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  // 2. Mọi User: Lấy danh sách tổ chức ĐÃ ĐƯỢC DUYỆT (Trang OrganizationListPage)
  static async getApprovedList(req: Request, res: Response) {
    try {
      const data = await OrganizationService.getApprovedOrganizations();
      return res.status(200).json({ success: true, data });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // 3. Mọi User: Lấy chi tiết 1 tổ chức theo ID (Trang OrganizationDetailPage)
  static async getDetail(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data = await OrganizationService.getOrganizationById(id as string);
      return res.status(200).json({ success: true, data });
    } catch (error: any) {
      return res.status(404).json({ success: false, message: error.message || 'Không tìm thấy tổ chức' });
    }
  }
}
