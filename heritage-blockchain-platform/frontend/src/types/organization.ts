import { z } from 'zod';

export const CreateOrganizationSchema = z.object({
  name: z.string().min(1, 'Tên tổ chức không được để trống'),

  contactEmail: z.string()
    .min(1, 'Email không được để trống')
    .email('Định dạng email không hợp lệ')
    .regex(
      /^[a-zA-Z0-9._%+-]+@([a-zA-Z0-9.-]+\.)?(gov\.vn|edu\.vn|org\.vn)$/,
      'Chỉ chấp nhận email thuộc cơ quan (.gov.vn, .edu.vn, .org.vn)'
    ),

  legalDocumentUrls: z.array(
    z.string().url('Đường dẫn minh chứng không hợp lệ')
  )
    .min(1, 'Bắt buộc phải tải lên ít nhất 1 minh chứng pháp lý')
    .max(3, 'Chỉ được tải lên tối đa 3 ảnh/tài liệu')
});

// Infer type từ Zod Schema để dùng cho TypeScript
export type CreateOrganizationFormValues = z.infer<typeof CreateOrganizationSchema>;
