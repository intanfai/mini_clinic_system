
'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Registration extends Model {
    static associate(models) {
      Registration.belongsTo(models.Patient, { foreignKey: 'patient_id' });
      Registration.belongsTo(models.Doctor, { foreignKey: 'doctor_id' });
      Registration.belongsTo(models.Poli, { foreignKey: 'poli_id' });
      Registration.hasOne(models.Queue, { foreignKey: 'registration_id' });
      Registration.hasOne(models.MedicalRecord, { foreignKey: 'registration_id' });
    }
  }
  Registration.init({
    patient_id: DataTypes.INTEGER,
    doctor_id: DataTypes.INTEGER,
    poli_id: DataTypes.INTEGER,
    tanggal_kunjungan: DataTypes.DATEONLY,
    jenis_pembayaran: DataTypes.STRING,
    keluhan_awal: DataTypes.TEXT,
    status: DataTypes.ENUM('menunggu', 'checkin', 'pemeriksaan', 'selesai')
  }, { sequelize, modelName: 'Registration' });
  return Registration;
};