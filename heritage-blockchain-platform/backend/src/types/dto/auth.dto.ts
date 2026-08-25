// src/dtos/auth.dto.ts
import { IsEmail, IsString, MinLength, MaxLength, IsNotEmpty } from 'class-validator';
import { UserRole } from '../enums/rbac.js';
import { Exclude, Expose } from 'class-transformer';

export class RegisterDto {
  @IsNotEmpty({ message: 'Email không được để trống' })
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
  passwordRaw: string;

  @IsString()
  @MaxLength(255)
  fullName: string;
}

export class LoginDto {
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email: string;

  @IsString()
  passwordRaw: string;

  @IsString()
  deviceId?: string;
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

