import { z } from 'zod';

export type HeritageStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'VERIFIED'
  | 'REJECTED'
  | 'PUBLISHED';

export type Heritage = {
  id: string;
  heritageCode: string;
  name: string;
  description: string;
  category: string;
  source: string;
  sourceOrganization: string;
  sourceReference: string;
  status: HeritageStatus;
  createdBy?: string;
  verifiedBy?: string;
  createdAt: string;
  updatedAt: string;
};

export const heritagePayloadSchema = z.object({
  heritageCode: z.string()
    .min(3, 'Mã hồ sơ phải có ít nhất 3 ký tự')
    .max(20, 'Mã hồ sơ tối đa 20 ký tự')
    .regex(/^[a-zA-Z0-9-_]+$/, 'Mã hồ sơ không được chứa khoảng trắng và ký tự đặc biệt'),

  name: z.string()
    .min(5, 'Tên di sản quá ngắn (tối thiểu 5 ký tự)'),

  description: z.string()
    .min(20, 'Mô tả quá ngắn, cần cung cấp đủ thông tin chi tiết'),

  category: z.string()
    .min(1, 'Vui lòng nhập loại hình di sản'),

  source: z.string()
    .min(1, 'Vui lòng nhập nguồn dữ liệu'),

  sourceOrganization: z.string()
    .min(1, 'Vui lòng nhập tổ chức nguồn'),

  sourceReference: z.string()
    .min(1, 'Vui lòng nhập tài liêu tham chiếu'),
});

export type HeritagePayload = z.infer<typeof heritagePayloadSchema>;

export type ApiResponse<T> = {
  success: boolean;
  status: number;
  message: string;
  data: T;
};

export type VerificationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export type Verification = {
  id: string;
  heritageId: string;
  reviewerId?: string;
  status: VerificationStatus;
  notes?: string;
  heritage?: Heritage;
  createdAt: string;
  updatedAt: string;
};
