import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { RequestHandler } from 'express';

export function validateDto(dtoClass: any): RequestHandler {
  return async (req, res, next) => {
    // 1. Chuyển JSON body thành instance DTO
    const dtoInstance = plainToInstance(dtoClass, req.body);

    // 2. Kiểm tra lỗi
    const errors = await validate(dtoInstance);

    if (errors.length > 0) {
      const errorMessages = errors
        .map((err) => Object.values(err.constraints || {}))
        .flat();

      return res.status(400).json({
        success: false,
        message: 'Dữ liệu không hợp lệ',
        errors: errorMessages,
      });
    }

    // 3. Gán lại body đã validate/transform và đi tiếp
    req.body = dtoInstance;
    next();
  };
}
