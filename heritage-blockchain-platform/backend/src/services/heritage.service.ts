import { AppDataSource } from '../config/database.js';
import { Heritage } from '../models/heritage.model.js';

export class HeritageService {
  async listHeritages() {
    const repo = AppDataSource.getRepository(Heritage);
    return repo.find({ take: 20, order: { createdAt: 'DESC' } });
  }

  async getHeritage(id: string) {
    const repo = AppDataSource.getRepository(Heritage);
    return repo.findOneBy({ id });
  }
}

