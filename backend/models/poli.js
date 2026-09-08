'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Poli extends Model {
    static associate(models) {
      Poli.hasMany(models.Doctor, { foreignKey: 'poli_id' });
      Poli.hasMany(models.Registration, { foreignKey: 'poli_id' });
    }
  }
  Poli.init({
    nama_poli: DataTypes.STRING
  }, { sequelize, modelName: 'Poli' });
  return Poli;
};