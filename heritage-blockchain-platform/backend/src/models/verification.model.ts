import { DataTypes, Model, type InferAttributes, type InferCreationAttributes } from 'sequelize';
import { sequelize } from '../config/database.js';

export enum VerificationStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export class Verification extends Model<InferAttributes<Verification>, InferCreationAttributes<Verification>> {
  declare id?: string;
  declare heritageId: string;
  declare reviewerId: string;
  declare status: VerificationStatus;
  declare notes?: string;
}

Verification.init(
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
    reviewerId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM(...Object.values(VerificationStatus)),
      allowNull: false,
      defaultValue: VerificationStatus.PENDING
    },
    notes: DataTypes.TEXT
  },
  {
    sequelize,
    tableName: 'verifications'
  }
);

