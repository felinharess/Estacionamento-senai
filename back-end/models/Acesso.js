import { DataTypes } from "sequelize";
import { database } from '../database/database.js';
import { Veiculo } from './Veiculo.js';

export const Acesso = database.define('acesso', {
  id_acesso: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_veiculo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Veiculo,
      key: 'id_veiculo'
    }
  },
  data_entrada: DataTypes.DATEONLY,
  hora_entrada: DataTypes.TIME,
  data_saida: DataTypes.DATEONLY,
  hora_saida: DataTypes.TIME,
  status: DataTypes.ENUM('ativo', 'concluido', 'pendente') 
}, {
  timestamps: false
});

Veiculo.hasMany(Acesso, { foreignKey: 'id_veiculo' });
Acesso.belongsTo(Veiculo, { foreignKey: 'id_veiculo' });
