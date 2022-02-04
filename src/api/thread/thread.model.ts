import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../utils/db';

class Thread extends Model {}
Thread.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  date_created: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  title: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'thread',
});

export default Thread;
