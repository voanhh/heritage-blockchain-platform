// src/dtos/auth.dto.ts
import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';
import { UserRole } from '../enums/rbac.js';
import { Exclude, Expose } from 'class-transformer';
import { Organization } from '../../models/organization.model.js';

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
  organizationId?: Organization;
}

@Exclude()
export class AuthResponseDto {
  @Expose()
  accessToken: string

  @Expose()
  expiredIn: number

  @Expose()
  userData: UserResponseDto

}
