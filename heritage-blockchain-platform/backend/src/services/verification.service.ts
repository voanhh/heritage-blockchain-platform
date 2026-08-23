import { AppDataSource } from '../config/database.js';
import { Heritage, HeritageStatus } from '../models/heritage.model.js';
import { Verification, VerificationStatus } from '../models/verification.model.js';

export type VerificationInput = {
  reviewerId?: string;
  notes?: string;
};

export class VerificationService {
  private static get heritageRepository() {
    return AppDataSource.getRepository(Heritage);
  }

  private static get verificationRepository() {
    return AppDataSource.getRepository(Verification);
  }

  static async getAllVerifications() {
    return this.verificationRepository.find({
      order: {
        createdAt: 'DESC'
      }
    });
  }

  static async getVerificationById(id: string) {
    return this.verificationRepository.findOneBy({ id });
  }

  static async startReview(heritageId: string, input: VerificationInput) {
    const heritage = await this.heritageRepository.findOneBy({ id: heritageId });

    if (!heritage) {
      throw new Error('HERITAGE_NOT_FOUND');
    }

    if (heritage.status !== HeritageStatus.SUBMITTED) {
      throw new Error('HERITAGE_MUST_BE_SUBMITTED');
    }

    heritage.status = HeritageStatus.UNDER_REVIEW;
    await this.heritageRepository.save(heritage);

    const verification = this.verificationRepository.create({
      heritageId,
      reviewerId: input.reviewerId,
      status: VerificationStatus.PENDING,
      notes: input.notes?.trim()
    });

    return this.verificationRepository.save(verification);
  }

  static async approveHeritage(heritageId: string, input: VerificationInput) {
    const heritage = await this.heritageRepository.findOneBy({ id: heritageId });

    if (!heritage) {
      throw new Error('HERITAGE_NOT_FOUND');
    }

    if (heritage.status !== HeritageStatus.UNDER_REVIEW) {
      throw new Error('HERITAGE_MUST_BE_UNDER_REVIEW');
    }

    const verification = await this.findLatestVerificationOrCreate(heritageId, input);
    verification.status = VerificationStatus.APPROVED;
    verification.notes = input.notes?.trim() ?? verification.notes;
    verification.reviewerId = input.reviewerId ?? verification.reviewerId;

    heritage.status = HeritageStatus.VERIFIED;

    await this.verificationRepository.save(verification);
    await this.heritageRepository.save(heritage);

    return verification;
  }

  static async rejectHeritage(heritageId: string, input: VerificationInput) {
    const heritage = await this.heritageRepository.findOneBy({ id: heritageId });

    if (!heritage) {
      throw new Error('HERITAGE_NOT_FOUND');
    }

    if (heritage.status !== HeritageStatus.UNDER_REVIEW) {
      throw new Error('HERITAGE_MUST_BE_UNDER_REVIEW');
    }

    const verification = await this.findLatestVerificationOrCreate(heritageId, input);
    verification.status = VerificationStatus.REJECTED;
    verification.notes = input.notes?.trim() ?? verification.notes;
    verification.reviewerId = input.reviewerId ?? verification.reviewerId;

    heritage.status = HeritageStatus.REJECTED;

    await this.verificationRepository.save(verification);
    await this.heritageRepository.save(heritage);

    return verification;
  }

  private static async findLatestVerificationOrCreate(heritageId: string, input: VerificationInput) {
    const verification = await this.verificationRepository.findOne({
      where: {
        heritageId
      },
      order: {
        createdAt: 'DESC'
      }
    });

    if (verification) {
      return verification;
    }

    return this.verificationRepository.create({
      heritageId,
      reviewerId: input.reviewerId,
      status: VerificationStatus.PENDING,
      notes: input.notes?.trim()
    });
  }
}
