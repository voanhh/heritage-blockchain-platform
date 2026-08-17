import { Request, Response } from 'express';
import { HeritageService } from '../services/heritage.service.js';
import { successHandler, errorHandler } from '../utils/responseHandler.js';

export class HeritageController {

  static async getAllHeritages(request: Request, response: Response) {
    try {
      const heritages = await HeritageService.getAllHeritages();

      return response.json(successHandler(200, 'Lấy danh sách di sản thành công', heritages));
    } catch (error) {
      return response.json(errorHandler(500, 'Lỗi khi lấy danh sách di sản'));
    }
  }

  static async getHeritageById(request: Request, response: Response) {
    const heritageId = String(request.params.id);

    try {
      const heritage = await HeritageService.getHeritageById(heritageId);

      if (!heritage) {
        return response.json(errorHandler(404, 'Di sản không tồn tại'));
      }

      return response.json(successHandler(200, 'Lấy thông tin di sản thành công', heritage));
    } catch (error) {
      return response.json(errorHandler(500, 'Lỗi khi lấy thông tin di sản'));
    }
  }

  // POST /api/heritages
  static async createHeritage(request: Request, response: Response) {
    try {
      const heritageData = request.body;

      const newHeritage =
        await HeritageService.createHeritage(heritageData);

      return response.json(successHandler(201, 'Tạo di sản thành công', newHeritage));
    } catch (error) {
      console.error('Lỗi khi tạo di sản:', error);

      return response.json(errorHandler(500, 'Lỗi khi tạo di sản'));
    }
  }

  static async updateHeritage(request: Request, response: Response) {
    const heritageId = String(request.params.id);

    try {
      const heritageData = request.body;

      const updatedHeritage =
        await HeritageService.updateHeritage(
          heritageId,
          heritageData
        );

      return response.json(successHandler(200,'Cập nhật di sản thành công',updatedHeritage));
    } catch (error) {
      console.error('Lỗi khi cập nhật di sản:', error);

      return response.json(errorHandler(500, 'Lỗi khi cập nhật di sản'));
    }
  }

  static async deleteHeritage(request: Request, response: Response) {
    const heritageId = String(request.params.id);

    try {
      await HeritageService.deleteHeritage(heritageId);

      return response.json(successHandler(200, 'Xóa di sản thành công'));
    } catch (error) {
      console.error('Lỗi khi xóa di sản:', error);

      return response.json(errorHandler(500, 'Lỗi khi xóa di sản'));
    }
  }
}