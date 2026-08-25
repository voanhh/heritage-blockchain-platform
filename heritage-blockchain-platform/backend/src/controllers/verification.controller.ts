import { Request, Response } from 'express';
import { VerificationService } from '../services/verification.service.js';
import { errorHandler, successHandler } from '../utils/responseHandler.js';

export class VerificationController {
  static async getAllVerifications(_request: Request, response: Response) {
    try {
      const verifications = await VerificationService.getAllVerifications();

      return response.status(200).json(successHandler(200, 'Lay danh sach kiem duyet thanh cong', verifications));
    } catch (error) {
      return VerificationController.handleError(error, response, 'Loi khi lay danh sach kiem duyet');
    }
  }

  static async getVerificationById(request: Request, response: Response) {
    try {
      const verification = await VerificationService.getVerificationById(String(request.params.id));

      if (!verification) {
        return response.status(404).json(errorHandler(404, 'Ban ghi kiem duyet khong ton tai'));
      }

      return response.status(200).json(successHandler(200, 'Lay thong tin kiem duyet thanh cong', verification));
    } catch (error) {
      return VerificationController.handleError(error, response, 'Loi khi lay thong tin kiem duyet');
    }
  }

  static async getVerificationsByHeritageId(request: Request, response: Response) {
    try {
      const verifications = await VerificationService.getVerificationsByHeritageId(String(request.params.heritageId));

      return response.status(200).json(successHandler(200, 'Lay lich su kiem duyet cua ho so thanh cong', verifications));
    } catch (error) {
      return VerificationController.handleError(error, response, 'Loi khi lay lich su kiem duyet cua ho so');
    }
  }

  static async startReview(request: Request, response: Response) {
    try {
      const verification = await VerificationService.startReview(String(request.params.heritageId), request.body);

      return response.status(201).json(successHandler(201, 'Bat dau kiem duyet ho so thanh cong', verification));
    } catch (error) {
      return VerificationController.handleError(error, response, 'Loi khi bat dau kiem duyet ho so');
    }
  }

  static async approveHeritage(request: Request, response: Response) {
    try {
      const verification = await VerificationService.approveHeritage(String(request.params.heritageId), request.body);

      return response.status(200).json(successHandler(200, 'Phe duyet ho so di san thanh cong', verification));
    } catch (error) {
      return VerificationController.handleError(error, response, 'Loi khi phe duyet ho so di san');
    }
  }

  static async rejectHeritage(request: Request, response: Response) {
    try {
      const verification = await VerificationService.rejectHeritage(String(request.params.heritageId), request.body);

      return response.status(200).json(successHandler(200, 'Tu choi ho so di san thanh cong', verification));
    } catch (error) {
      return VerificationController.handleError(error, response, 'Loi khi tu choi ho so di san');
    }
  }

  private static handleError(error: unknown, response: Response, fallbackMessage: string) {
    if (error instanceof Error) {
      if (error.message === 'HERITAGE_NOT_FOUND') {
        return response.status(404).json(errorHandler(404, 'Ho so di san khong ton tai'));
      }

      if (error.message === 'HERITAGE_MUST_BE_SUBMITTED') {
        return response.status(409).json(errorHandler(409, 'Chi ho so SUBMITTED moi co the bat dau kiem duyet'));
      }

      if (error.message === 'HERITAGE_MUST_BE_UNDER_REVIEW') {
        return response.status(409).json(errorHandler(409, 'Chi ho so UNDER_REVIEW moi co the phe duyet hoac tu choi'));
      }
    }

    return response.status(500).json(errorHandler(500, fallbackMessage));
  }
}
