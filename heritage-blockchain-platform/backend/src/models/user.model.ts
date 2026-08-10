import { DataTypes, Model, type InferAttributes, type InferCreationAttributes } from 'sequelize';
import { sequelize } from '../config/database.js';
import { UserRole } from '../types/rbac.js';

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id?: string;
  declare organizationId?: string;
  declare email: string;
  declare passwordHash: string;
  declare fullName: string;
  declare role: UserRole;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    organizationId: DataTypes.UUID,
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM(...Object.values(UserRole)),
      allowNull: false,
      defaultValue: UserRole.USER
    }
  },
  {
    sequelize,
    tableName: 'users'
  }
);

