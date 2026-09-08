'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Queues', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      registration_id: {
        type: Sequelize.INTEGER, allowNull: false, unique: true, // 1 registrasi = 1 antrean
        references: { model: 'Registrations', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE'
      },
      nomor_antrean: { type: Sequelize.STRING, allowNull: false }, // contoh: "A001"
      status: {
        type: Sequelize.ENUM('menunggu', 'dipanggil', 'selesai'),
        allowNull: false,
        defaultValue: 'menunggu'
      },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('Queues');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Queues_status";');
  }
};