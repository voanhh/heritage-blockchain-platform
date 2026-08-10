import { DataTypes, Model, type InferAttributes, type InferCreationAttributes } from 'sequelize';
import { sequelize } from '../config/database.js';

export enum HeritageStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED',
  PUBLISHED = 'PUBLISHED'
}

export class Heritage extends Model<InferAttributes<Heritage>, InferCreationAttributes<Heritage>> {
  declare id?: string;
  declare heritageCode: string;
  declare name: string;
  declare description: string;
  declare category: string;
  declare source: string;
  declare sourceOrganization: string;
  declare sourceReference: string;
  declare status: HeritageStatus;
  declare createdBy?: string;
  declare verifiedBy?: string;
}

Heritage.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    heritageCode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false
    },
    source: {
      type: DataTypes.STRING,
      allowNull: false
    },
    sourceOrganization: {
      type: DataTypes.STRING,
      allowNull: false
    },
    sourceReference: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM(...Object.values(HeritageStatus)),
      allowNull: false,
      defaultValue: HeritageStatus.DRAFT
    },
    createdBy: DataTypes.UUID,
    verifiedBy: DataTypes.UUID
  },
  {
    sequelize,
    tableName: 'heritages'
  }
);

