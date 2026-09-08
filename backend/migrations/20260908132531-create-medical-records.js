'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('MedicalRecords', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      registration_id: {
        type: Sequelize.INTEGER, allowNull: false, unique: true,
        references: { model: 'Registrations', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE'
      },
      // Subjective
      keluhan: { type: Sequelize.TEXT },
      // Objective
      tekanan_darah: { type: Sequelize.STRING }, // mis: "120/80"
      suhu_tubuh: { type: Sequelize.FLOAT },
      berat_badan: { type: Sequelize.FLOAT },
      tinggi_badan: { type: Sequelize.FLOAT },
      // Assessment
      diagnosa: { type: Sequelize.TEXT },
      // Plan
      rencana_terapi: { type: Sequelize.TEXT },
      tindakan_medis: { type: Sequelize.TEXT },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('MedicalRecords');
  }
};