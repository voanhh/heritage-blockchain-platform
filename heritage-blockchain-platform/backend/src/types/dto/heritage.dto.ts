// src/types/dto/create-heritage.dto.ts
import { IsNotEmpty, IsString, IsOptional, MaxLength, IsEnum } from 'class-validator';
import { HeritageStatus } from '../enums/heritage.enum.js';

export class CreateHeritageDto {
  @IsString()
  @IsNotEmpty({ message: 'Mã hồ sơ không được để trống' })
  heritageCode!: string;

  @IsString()
  @IsNotEmpty({ message: 'Tên di sản không được để trống' })
  name!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsString()
  @IsNotEmpty({ message: 'Thể loại không được để trống' })
  category!: string;

  @IsString()
  @IsNotEmpty()
  source!: string;

  @IsString()
  sourceOrganization!: string;

  @IsString()
  //IsOptional() hien tai khong cho de trong
  sourceReference?: string;
}

export class UpdateStatusDto {
  @IsEnum(HeritageStatus, { message: 'Trạng thái không hợp lệ' })
  @IsNotEmpty({ message: 'Trạng thái không được để trống' })
  status!: HeritageStatus;
}
