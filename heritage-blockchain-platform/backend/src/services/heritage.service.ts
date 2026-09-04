import { AppDataSource } from '../config/database.js';
import { Heritage } from '../models/heritage.model.js';
import { CreateHeritageDto, UpdateStatusDto } from '../types/dto/heritage.dto.js';
import { HeritageStatus } from '../types/enums/heritage.enum.js';


export class HeritageService {
  private static get heritageRepository() {
    return AppDataSource.getRepository(Heritage);
  }

  static async getAllHeritages(filters: { status?: HeritageStatus; search?: string }) {
    const query = this.heritageRepository
      .createQueryBuilder('heritage')
      .orderBy('heritage.createdAt', 'DESC');

    if (filters.status) {
      query.andWhere('heritage.status = :status', { status: filters.status });
    }

    if (filters.search) {
      query.andWhere('(heritage.name LIKE :search OR heritage.heritageCode LIKE :search)', {
        search: `%${filters.search}%`
      });
    }

    return query.getMany();
  }

  static async getRecentHeritages(limit = 5) {
    return this.heritageRepository.find({
      take: limit,
      order: {
        createdAt: 'DESC'
      }
    });
  }

  static async getHeritageById(id: string) {
    return this.heritageRepository.findOneBy({
      id,
    });
  }

  static async createHeritage(heritageData: CreateHeritageDto) {
    const duplicate = await this.heritageRepository.findOneBy({
      heritageCode: heritageData.heritageCode.trim()
    });

    if (duplicate) {
      throw new Error('HERITAGE_CODE_EXISTS');
    }

    const newHeritage = this.heritageRepository.create({
      heritageCode: heritageData.heritageCode!.trim(),
      name: heritageData.name!.trim(),
      description: heritageData.description!.trim(),
      category: heritageData.category!.trim(),
      source: heritageData.source!.trim(),
      sourceOrganization: heritageData.sourceOrganization!.trim(),
      sourceReference: heritageData.sourceReference!.trim(),
      status: HeritageStatus.DRAFT
    });

    return this.heritageRepository.save(newHeritage);
  }

  static async updateHeritage(id: string, heritageData: CreateHeritageDto) {
    const heritage =
      await this.heritageRepository.findOneBy({ id });

    if (!heritage) {
      throw new Error('Heritage not found');
    }

    if (heritageData.heritageCode && heritageData.heritageCode.trim() !== heritage.heritageCode) {
      const duplicate = await this.heritageRepository.findOneBy({
        heritageCode: heritageData.heritageCode.trim()
      });

      if (duplicate) {
        throw new Error('HERITAGE_CODE_EXISTS');
      }
    }

    heritage.heritageCode = heritageData.heritageCode?.trim() ?? heritage.heritageCode;
    heritage.name = heritageData.name?.trim() ?? heritage.name;
    heritage.description = heritageData.description?.trim() ?? heritage.description;
    heritage.category = heritageData.category?.trim() ?? heritage.category;
    heritage.source = heritageData.source?.trim() ?? heritage.source;
    heritage.sourceOrganization = heritageData.sourceOrganization?.trim() ?? heritage.sourceOrganization;
    heritage.sourceReference = heritageData.sourceReference?.trim() ?? heritage.sourceReference;

    return this.heritageRepository.save(heritage);
  }

  static async submitHeritage(id: string) {
    const heritage = await this.heritageRepository.findOneBy({ id });

    if (!heritage) {
      throw new Error('HERITAGE_NOT_FOUND');
    }

    if (heritage.status !== HeritageStatus.DRAFT && heritage.status !== HeritageStatus.REJECTED) {
      throw new Error('HERITAGE_CANNOT_BE_SUBMITTED');
    }

    heritage.status = HeritageStatus.SUBMITTED;
    return this.heritageRepository.save(heritage);
  }

  static async updateHeritageStatus(id: string, status: UpdateStatusDto) {
    const heritage = await this.heritageRepository.findOneBy({ id });

    if (!heritage) {
      throw new Error('HERITAGE_NOT_FOUND');
    }
    console.log(status.status)
    heritage.status = status.status;
    return this.heritageRepository.save(heritage);
  }

  static async deleteHeritage(id: string) {
    const heritage = await this.heritageRepository.findOneBy({ id });

    if (!heritage) {
      throw new Error('HERITAGE_NOT_FOUND');
    }

    return this.heritageRepository.remove(heritage);
  }
}
