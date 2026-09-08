'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Doctors', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'id' }, // ini yang bikin jadi Foreign Key
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE' // kalau User-nya dihapus, data Doctor ikut kehapus
      },
      poli_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Polis', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT' // poli nggak boleh dihapus kalau masih ada dokternya
      },
      nama_dokter: { type: Sequelize.STRING, allowNull: false },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('Doctors');
  }
};