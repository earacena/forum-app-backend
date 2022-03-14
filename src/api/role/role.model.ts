import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../utils/db';

class Role extends Model {}
Role.init({
  userId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  role: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'role',
});

export default Role;
