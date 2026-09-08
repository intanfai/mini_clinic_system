
'use strict';

module.exports = {
  up: async (queryInterface) => {
    const now = new Date();

    // Membuat data poli klinik
    await queryInterface.bulkInsert('Polis', [
      {
        nama_poli: 'Poli Umum',
        createdAt: now,
        updatedAt: now,
      },
      {
        nama_poli: 'Poli Gigi',
        createdAt: now,
        updatedAt: now,
      },
    ]);
  },

  down: async (queryInterface) => {
    // Menghapus data poli yang dibuat oleh seeder ini
    await queryInterface.bulkDelete('Polis', {
      nama_poli: ['Poli Umum', 'Poli Gigi'],
    });
  },
};

