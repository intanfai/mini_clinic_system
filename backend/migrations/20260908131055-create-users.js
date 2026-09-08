"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true, // nggak boleh ada 2 user email sama
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false, // ini nanti diisi hash, bukan plain text
      },
      role: {
        // ENUM = tipe data yang cuma boleh diisi salah satu dari list ini
        // gunanya biar role nggak bisa diisi sembarang string
        type: Sequelize.ENUM("administrator", "dokter", "petugas_pendaftaran"),
        allowNull: false,
      },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable("Users");
    // di postgres, ENUM bikin type terpisah, jadi harus di-drop manual
    // biar migration:undo bisa dijalankan ulang tanpa error
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Users_role";');
  },
};
