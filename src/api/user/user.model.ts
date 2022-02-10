import { DataTypes, Model, Sequelize } from 'sequelize';
import { sequelize } from '../../utils/db';

class User extends Model {}
User.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  name: {
    type: DataTypes.TEXT,
  },
  dateRegistered: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
  },
  passwordHash: {
    type: DataTypes.CHAR(60),
  },
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'user',
});

export default User;
