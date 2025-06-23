import { DataTypes } from "sequelize";
import { database } from '../database/database.js';

export const Admin = database.define('admin', {
  id_admin: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nome: DataTypes.STRING,
  email: DataTypes.STRING,
  senha: DataTypes.STRING
}, {
  timestamps: false
});
