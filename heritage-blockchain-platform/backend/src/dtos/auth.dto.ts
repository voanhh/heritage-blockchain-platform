// src/dtos/auth.dto.ts
import { IsEmail, IsString, MinLength, IsOptional, IsEnum, MaxLength } from 'class-validator';
import { UserRole } from '../types/rbac.js';
import { Exclude, Expose } from 'class-transformer';

export class RegisterDto {
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
  password: string;

  @IsString()
  @MaxLength(255)
  fullName: string;
}

export class LoginDto {
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email: string;

  @IsString()
  password: string;
}

@Exclude()
export class UserResponseDto {
  @Expose()
  id: string;

  @Expose()
  email: string;

  @Expose()
  fullName: string;

  @Expose()
  role: UserRole;

  @Expose()
  organizationId?: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

}

