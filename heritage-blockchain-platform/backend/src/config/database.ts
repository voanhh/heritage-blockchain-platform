import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from '../models/user.model.js';
import { Organization } from '../models/organization.model.js';
import { Heritage } from '../models/heritage.model.js';
import { HeritageVersion } from '../models/heritage-version.model.js';
import { BlockchainRecord } from '../models/blockchain-record.model.js';
import { Verification } from '../models/verification.model.js';
import * as dotenv from 'dotenv';
import * as path from 'path';


dotenv.config({ path: path.resolve(process.cwd(), '../.env') });
export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 3306),
  username: process.env.DB_USER ?? 'root',
  password: process.env.DB_USER_PASSWORD ?? '',
  database: process.env.DB_NAME ?? 'heritage_blockchain',
  entities: [User, Organization, Heritage, HeritageVersion, BlockchainRecord, Verification],
  // For development default to true so schema is created automatically. Disable in production.
  synchronize: process.env.NODE_ENV === 'production' ? false : true,
  logging: process.env.DB_LOGGING === 'true'
});

export async function initializeDatabase() {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
}
