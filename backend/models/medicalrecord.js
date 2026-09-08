'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MedicalRecord extends Model {
    static associate(models) {
      MedicalRecord.belongsTo(models.Registration, { foreignKey: 'registration_id' });
      MedicalRecord.hasMany(models.Prescription, { foreignKey: 'medical_record_id' });
    }
  }
  MedicalRecord.init({
    registration_id: DataTypes.INTEGER,
    keluhan: DataTypes.TEXT,
    tekanan_darah: DataTypes.STRING,
    suhu_tubuh: DataTypes.FLOAT,
    berat_badan: DataTypes.FLOAT,
    tinggi_badan: DataTypes.FLOAT,
    diagnosa: DataTypes.TEXT,
    rencana_terapi: DataTypes.TEXT,
    tindakan_medis: DataTypes.TEXT
  }, { sequelize, modelName: 'MedicalRecord' });
  return MedicalRecord;
};