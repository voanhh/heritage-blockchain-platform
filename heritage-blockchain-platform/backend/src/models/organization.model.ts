import { DataTypes, Model, type InferAttributes, type InferCreationAttributes } from 'sequelize';
import { sequelize } from '../config/database.js';

export class Organization extends Model<InferAttributes<Organization>, InferCreationAttributes<Organization>> {
  declare id?: string;
  declare name: string;
  declare description?: string;
}

Organization.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: DataTypes.TEXT
  },
  {
    sequelize,
    tableName: 'organizations'
  }
);

