'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Prescriptions', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      medical_record_id: {
        type: Sequelize.INTEGER, allowNull: false,
        references: { model: 'MedicalRecords', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE'
      },
      nama_obat: { type: Sequelize.STRING, allowNull: false },
      dosis: { type: Sequelize.STRING },
      jumlah: { type: Sequelize.INTEGER },
      aturan_pakai: { type: Sequelize.STRING }, // mis: "3x1 sehari setelah makan"
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('Prescriptions');
  }
};