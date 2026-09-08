'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // kalau dokter disimpan sebagai relasi ke Doctor (lihat tabel Doctors)
      User.hasOne(models.Doctor, { foreignKey: 'user_id' });
    }
  }
  User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.ENUM('administrator', 'dokter', 'petugas_pendaftaran')
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};