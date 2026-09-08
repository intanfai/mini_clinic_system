'use strict';

module.exports = {
  async up(queryInterface) {
    const now = new Date();

    // Ambil User dokter
    const [users] = await queryInterface.sequelize.query(`
      SELECT id, email
      FROM "Users"
      WHERE email IN ('andi@klinik.com', 'siti@klinik.com')
    `);

    const userAndi = users.find(
      (user) => user.email === 'andi@klinik.com'
    );

    const userSiti = users.find(
      (user) => user.email === 'siti@klinik.com'
    );

    if (!userAndi || !userSiti) {
      throw new Error('User dokter tidak ditemukan');
    }

    // Ambil Poli
    const [polis] = await queryInterface.sequelize.query(`
      SELECT id, nama_poli
      FROM "Polis"
      WHERE nama_poli IN ('Poli Umum', 'Poli Gigi')
    `);

    const poliUmum = polis.find(
      (poli) => poli.nama_poli === 'Poli Umum'
    );

    const poliGigi = polis.find(
      (poli) => poli.nama_poli === 'Poli Gigi'
    );

    if (!poliUmum || !poliGigi) {
      throw new Error('Poli tidak ditemukan');
    }

    // Buat data Doctor
    await queryInterface.bulkInsert('Doctors', [
      {
        user_id: userAndi.id,
        poli_id: poliUmum.id,
        nama_dokter: 'Dr. Andi',
        createdAt: now,
        updatedAt: now,
      },
      {
        user_id: userSiti.id,
        poli_id: poliGigi.id,
        nama_dokter: 'Dr. Siti',
        createdAt: now,
        updatedAt: now,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Doctors', {
      nama_dokter: ['Dr. Andi', 'Dr. Siti'],
    });
  },
};