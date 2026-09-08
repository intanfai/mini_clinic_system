// models/prescription.js
'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Prescription extends Model {
    static associate(models) {
      Prescription.belongsTo(models.MedicalRecord, { foreignKey: 'medical_record_id' });
    }
  }
  Prescription.init({
    medical_record_id: DataTypes.INTEGER,
    nama_obat: DataTypes.STRING,
    dosis: DataTypes.STRING,
    jumlah: DataTypes.INTEGER,
    aturan_pakai: DataTypes.STRING
  }, { sequelize, modelName: 'Prescription' });
  return Prescription;
};