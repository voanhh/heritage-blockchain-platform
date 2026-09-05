// src/types/dto/create-organization.dto.ts
import { IsString, IsNotEmpty, Matches } from 'class-validator';

export class CreateOrganizationDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty({ message: 'Email không được để trống' })
  // Regex: Chỉ chấp nhận tên miền .gov.vn, .edu.vn, hoặc .org.vn
  @Matches(/^[a-zA-Z0-9._%+-]+@([a-zA-Z0-9.-]+\.)?(gov\.vn|edu\.vn|org\.vn)$/, {
    message: 'Chỉ chấp nhận email thuộc cơ quan nhà nước hoặc tổ chức giáo dục (.gov.vn, .edu.vn, .org.vn)'
  })
  contactEmail!: string;

  @IsString()
  @IsNotEmpty({ message: 'Bắt buộc phải tải lên minh chứng pháp lý' })
  legalDocumentUrl!: string;
}
