import { DataTypes } from "sequelize";
import { database } from '../database/database.js';

export const Usuario = database.define('usuario', {
  id_usuario: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nome: DataTypes.STRING,
  email: DataTypes.STRING,
  cpf: DataTypes.STRING,
  senha: DataTypes.STRING,
  tipo_usuario: DataTypes.ENUM('comum', 'especial') // exemplo de enum
}, {
  timestamps: false
});
