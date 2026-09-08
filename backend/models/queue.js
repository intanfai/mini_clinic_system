
'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Queue extends Model {
    static associate(models) {
      Queue.belongsTo(models.Registration, { foreignKey: 'registration_id' });
    }
  }
  Queue.init({
    registration_id: DataTypes.INTEGER,
    nomor_antrean: DataTypes.STRING,
    status: DataTypes.ENUM('menunggu', 'dipanggil', 'selesai')
  }, { sequelize, modelName: 'Queue' });
  return Queue;
};