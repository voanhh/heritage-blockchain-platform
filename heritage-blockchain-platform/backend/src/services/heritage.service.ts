import { AppDataSource } from '../config/database.js';
import { Heritage } from '../models/heritage.model.js';

export class HeritageService {

  private static heritageRepository = AppDataSource.getRepository(Heritage);

  static async getAllHeritages() {
    return this.heritageRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });
  }

  static async getHeritageById(id: string) {
    return this.heritageRepository.findOneBy({
      id,
    });
  }

  static async createHeritage(heritageData: any) {
    const newHeritage = new Heritage();

    newHeritage.heritageCode = heritageData.heritageCode;
    newHeritage.name = heritageData.name;
    newHeritage.description = heritageData.description;
    newHeritage.category = heritageData.category;
    //newHeritage.location = heritageData.location;
    newHeritage.source = heritageData.source;
    newHeritage.sourceOrganization = heritageData.sourceOrganization;
    newHeritage.sourceReference = heritageData.sourceReference;
    newHeritage.status = heritageData.status ?? 'hehe';

    return this.heritageRepository.save(newHeritage);
  }

  static async updateHeritage(id: string, heritageData: any) {
    const heritage =
      await this.heritageRepository.findOneBy({ id });

    if (!heritage) {
      throw new Error('Heritage not found');
    }

    heritage.heritageCode = heritageData.heritageCode ?? heritage.heritageCode;
    heritage.name = heritageData.name ?? heritage.name;
    heritage.description = heritageData.description ?? heritage.description;
    heritage.category = heritageData.category ?? heritage.category;
    //heritage.location = heritageData.location ?? heritage.location;
    heritage.source = heritageData.source ?? heritage.source;
    heritage.sourceOrganization = heritageData.sourceOrganization ?? heritage.sourceOrganization;
    heritage.sourceReference = heritageData.sourceReference ?? heritage.sourceReference;
    heritage.status = heritageData.status ?? heritage.status;

    return this.heritageRepository.save(heritage);
  }

  static async deleteHeritage(id: string) {
    const heritage = await this.heritageRepository.findOneBy({ id });

    if (!heritage) {
      throw new Error('Heritage not found');
    }

    return this.heritageRepository.remove(heritage);
  }
}