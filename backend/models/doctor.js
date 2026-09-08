'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Doctor extends Model {
    static associate(models) {
      Doctor.belongsTo(models.User, { foreignKey: 'user_id' });
      Doctor.belongsTo(models.Poli, { foreignKey: 'poli_id' });
      Doctor.hasMany(models.Registration, { foreignKey: 'doctor_id' });
    }
  }
  Doctor.init({
    user_id: DataTypes.INTEGER,
    poli_id: DataTypes.INTEGER,
    nama_dokter: DataTypes.STRING
  }, { sequelize, modelName: 'Doctor' });
  return Doctor;
};