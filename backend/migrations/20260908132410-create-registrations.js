'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Registrations', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      patient_id: {
        type: Sequelize.INTEGER, allowNull: false,
        references: { model: 'Patients', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'RESTRICT'
      },
      doctor_id: {
        type: Sequelize.INTEGER, allowNull: false,
        references: { model: 'Doctors', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'RESTRICT'
      },
      poli_id: {
        type: Sequelize.INTEGER, allowNull: false,
        references: { model: 'Polis', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'RESTRICT'
      },
      tanggal_kunjungan: { type: Sequelize.DATEONLY, allowNull: false },
      jenis_pembayaran: { type: Sequelize.STRING, allowNull: false }, // mis: "BPJS", "Umum"
      keluhan_awal: { type: Sequelize.TEXT },
      status: {
        type: Sequelize.ENUM('menunggu', 'checkin', 'pemeriksaan', 'selesai'),
        allowNull: false,
        defaultValue: 'menunggu'
      },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('Registrations');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Registrations_status";');
  }
};