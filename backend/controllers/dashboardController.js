const { Patient, Registration, Queue } = require('../models');
const { Op } = require('sequelize');

exports.getDashboard = async (req, res) => {
  try {
    const today = new Date().toISOString().slice(0, 10);

    // Total seluruh pasien
    const totalPasien = await Patient.count();

    // Total pasien yang melakukan kunjungan hari ini
    const totalPasienHariIni = await Registration.count({
      where: {
        tanggal_kunjungan: today
      }
    });

    // Total antrean hari ini
    const totalAntreanHariIni = await Queue.count({
      include: [
        {
          model: Registration,
          where: {
            tanggal_kunjungan: today
          }
        }
      ]
    });

    // Total pasien yang masih menunggu
    const totalPasienMenunggu = await Queue.count({
      where: {
        status: 'menunggu'
      },
      include: [
        {
          model: Registration,
          where: {
            tanggal_kunjungan: today
          }
        }
      ]
    });

    // Total pasien yang sudah selesai dilayani
    const totalPasienSelesai = await Queue.count({
      where: {
        status: 'selesai'
      },
      include: [
        {
          model: Registration,
          where: {
            tanggal_kunjungan: today
          }
        }
      ]
    });

    return res.status(200).json({
      success: true,
      message: 'Success',
      data: {
        total_pasien: totalPasien,
        total_pasien_hari_ini: totalPasienHariIni,
        total_antrean_hari_ini: totalAntreanHariIni,
        total_pasien_menunggu: totalPasienMenunggu,
        total_pasien_selesai: totalPasienSelesai
      }
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server',
      errors: {
        detail: err.message
      }
    });
  }
};