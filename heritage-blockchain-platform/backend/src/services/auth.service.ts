
import bcrypt from 'bcrypt'
import { AppDataSource } from '../config/database.js';
import { UserRole } from '../types/enums/rbac.js';
import { User } from '../models/user.model.js';
import { AuthResponseDto, LoginDto, RegisterDto } from '../types/dto/auth.dto.js';
import { TokenServices } from './token.service.js';
import { RefreshToken } from '../models/refresh-token.model.js';

export class AuthServices {

  static async register(data: RegisterDto): Promise<AuthResponseDto & { refreshToken: string }> {
    try {
      //check if phone existed
      const existingUser = await AppDataSource.getRepository(User).findOne({ where: { email: data.email } });
      if (existingUser) {
        throw new Error('EMAIL_IS_ALREADY_IN_USE!');
      }

      //hash
      const hashedPassword = await bcrypt.hash(data.passwordRaw, 10);

      const newUser = AppDataSource.getRepository(User).create({
        email: data.email,
        passwordHash: hashedPassword,
        fullName: data.fullName,
        role: UserRole.USER,
      })

      await AppDataSource.getRepository(User).save(newUser);
      return TokenServices.issueTokens(newUser);
    } catch (error) {
      throw error
    }
  }

  static async login(dto: LoginDto): Promise<AuthResponseDto & { refreshToken: string }> {
    const { email, passwordRaw, deviceId = 'default' } = dto;

    const user = await AppDataSource.getRepository(User).createQueryBuilder('User')
      .where('User.email = :email', { email })
      .addSelect('User.passwordHash') // select pwd
      .getOne();
    if (!user) throw new Error('INVALID_CREDENTIALS');

    const valid = await bcrypt.compare(passwordRaw, user.passwordHash);
    if (!valid) throw new Error('INVALID_CREDENTIALS');

    return TokenServices.issueTokens(user, deviceId);
  }

  static async refresh(
    deviceId = 'default',
    oldToken: string): Promise<AuthResponseDto & { refreshToken: string }> {
    const existingToken = await AppDataSource.getRepository(RefreshToken).findOne({
      where: { token: oldToken, deviceId, isRevoked: false },
      relations: ['user'] // Lấy luôn entity User nếu cần
    });

    if (!existingToken || existingToken.expiresAt < new Date()) {
      throw new Error('INVALID_OR_EXPIRED_TOKEN');
    };

    const userId = existingToken.userId;

    return await TokenServices.rotateTokens(userId, deviceId, oldToken);
  }

  static async logout(userId: string, deviceId = 'default'): Promise<void> {
    await TokenServices.revokeToken(userId, deviceId)
  }

  static async logoutAll(userId: string): Promise<void> {
    await TokenServices.revokeToken(userId)
  }
}
