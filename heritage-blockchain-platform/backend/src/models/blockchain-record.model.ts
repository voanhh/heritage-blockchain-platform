import { DataTypes, Model, type InferAttributes, type InferCreationAttributes } from 'sequelize';
import { sequelize } from '../config/database.js';

export class BlockchainRecord extends Model<
  InferAttributes<BlockchainRecord>,
  InferCreationAttributes<BlockchainRecord>
> {
  declare id?: string;
  declare heritageId: string;
  declare dataHash: string;
  declare version: number;
  declare verifier: string;
  declare transactionHash?: string;
  declare blockNumber?: number;
}

BlockchainRecord.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    heritageId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    dataHash: {
      type: DataTypes.STRING(64),
      allowNull: false
    },
    version: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    verifier: {
      type: DataTypes.STRING,
      allowNull: false
    },
    transactionHash: DataTypes.STRING,
    blockNumber: DataTypes.INTEGER
  },
  {
    sequelize,
    tableName: 'blockchain_records'
  }
);

