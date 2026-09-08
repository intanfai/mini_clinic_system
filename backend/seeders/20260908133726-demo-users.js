'use strict';

const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface) => {
    const hashedPassword = await bcrypt.hash('password123', 10);
    const now = new Date();

    await queryInterface.bulkInsert('Users', [
      {
        name: 'Admin Klinik',
        email: 'admin@klinik.com',
        password: hashedPassword,
        role: 'administrator',
        createdAt: now,
        updatedAt: now,
      },
      {
        name: 'Dr. Andi',
        email: 'andi@klinik.com',
        password: hashedPassword,
        role: 'dokter',
        createdAt: now,
        updatedAt: now,
      },
      {
        name: 'Dr. Siti',
        email: 'siti@klinik.com',
        password: hashedPassword,
        role: 'dokter',
        createdAt: now,
        updatedAt: now,
      },
      {
        name: 'Petugas Pendaftaran',
        email: 'petugas@klinik.com',
        password: hashedPassword,
        role: 'petugas_pendaftaran',
        createdAt: now,
        updatedAt: now,
      },
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('Users', {
      email: [
        'admin@klinik.com',
        'andi@klinik.com',
        'siti@klinik.com',
        'petugas@klinik.com',
      ],
    });
  },
};