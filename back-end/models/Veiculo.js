  import { DataTypes } from "sequelize";
  import { database } from '../database/database.js';
  import { Usuario } from './Usuario.js';

  export const Veiculo = database.define('veiculo', {
    id_veiculo: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Usuario,
        key: 'id_usuario'
      }
    },
    placa: DataTypes.STRING,
    modelo: DataTypes.STRING,
    cor: DataTypes.STRING,
    ano: DataTypes.INTEGER
  }, {
    timestamps: false
  });

  Usuario.hasMany(Veiculo, { foreignKey: 'id_usuario' });
  Veiculo.belongsTo(Usuario, { foreignKey: 'id_usuario' });
