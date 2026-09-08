
'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Patient extends Model {
    static associate(models) {
      Patient.hasMany(models.Registration, { foreignKey: 'patient_id' });
    }
  }
  Patient.init({
    no_rm: DataTypes.STRING,
    nik: DataTypes.STRING,
    nama: DataTypes.STRING,
    jenis_kelamin: DataTypes.ENUM('L', 'P'),
    tanggal_lahir: DataTypes.DATEONLY,
    no_telp: DataTypes.STRING,
    alamat: DataTypes.TEXT
  }, { sequelize, modelName: 'Patient' });
  return Patient;
};