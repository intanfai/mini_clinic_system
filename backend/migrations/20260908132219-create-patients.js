'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Patients', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      no_rm: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true // no rekam medis harus unik, di-generate di controller (bukan di DB)
      },
      nik: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true // ini requirement wajib dari soal: NIK gaboleh duplikat
      },
      nama: { type: Sequelize.STRING, allowNull: false },
      jenis_kelamin: { type: Sequelize.ENUM('L', 'P'), allowNull: false },
      tanggal_lahir: { type: Sequelize.DATEONLY, allowNull: false }, // DATEONLY = cuma tanggal, tanpa jam
      no_telp: { type: Sequelize.STRING },
      alamat: { type: Sequelize.TEXT },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('Patients');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Patients_jenis_kelamin";');
  }
};