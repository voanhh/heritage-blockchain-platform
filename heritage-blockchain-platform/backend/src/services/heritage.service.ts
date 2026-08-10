import { Heritage } from '../models/heritage.model.js';

export class HeritageService {
  async listHeritages() {
    return Heritage.findAll({ limit: 20, order: [['createdAt', 'DESC']] });
  }

  async getHeritage(id: string) {
    return Heritage.findByPk(id);
  }
}

