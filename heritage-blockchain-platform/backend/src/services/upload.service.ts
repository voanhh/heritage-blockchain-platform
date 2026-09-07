import cloudinary from '../config/cloudinary.config.js';
import streamifier from 'streamifier';

export class UploadService {
  static async uploadDocument(fileBuffer: Buffer): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'heritage_legal_docs',
          resource_type: 'auto',
        },
        (error, result) => {
          if (error || !result) {
            return reject(new Error('Lỗi khi upload file lên Cloudinary'));
          }
          resolve(result.secure_url); // Trả về URL thành công
        }
      );

      // Chuyển buffer thành stream và đẩy lên
      streamifier.createReadStream(fileBuffer).pipe(uploadStream);
    });
  }

  static async uploadMultipleDocuments(files: Express.Multer.File[]): Promise<string[]> {
    const uploadPromises = files.map(file => this.uploadDocument(file.buffer));
    return Promise.all(uploadPromises); // Đợi tất cả upload xong và trả về mảng các URL
  }
}
