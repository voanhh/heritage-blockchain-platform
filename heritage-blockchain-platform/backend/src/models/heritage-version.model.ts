import { DataTypes, Model, type InferAttributes, type InferCreationAttributes } from 'sequelize';
import { sequelize } from '../config/database.js';

export class HeritageVersion extends Model<
  InferAttributes<HeritageVersion>,
  InferCreationAttributes<HeritageVersion>
> {
  declare id?: string;
  declare heritageId: string;
  declare version: number;
  declare canonicalData: object;
  declare dataHash: string;
  declare createdBy?: string;
}

HeritageVersion.init(
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
    version: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    canonicalData: {
      type: DataTypes.JSON,
      allowNull: false
    },
    dataHash: {
      type: DataTypes.STRING(64),
      allowNull: false
    },
    createdBy: DataTypes.UUID
  },
  {
    sequelize,
    tableName: 'heritage_versions'
  }
);

