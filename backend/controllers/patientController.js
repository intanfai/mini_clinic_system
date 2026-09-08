const { Patient } = require('../models');
const { Op } = require('sequelize'); // Op = "Operator", dipakai buat query kayak LIKE, OR, dll

// Helper: generate nomor rekam medis otomatis
// Format: RM-20260908-0001 (tanggal hari ini + nomor urut hari itu)
async function generateNoRM() {
  const today = new Date();
  const dateStr = today.toISOString().slice(0, 10).replace(/-/g, ''); // "20260908"

  // hitung berapa pasien yang udah didaftarkan HARI INI, buat nentuin nomor urut
  const countToday = await Patient.count({
    where: {
      no_rm: { [Op.like]: `RM-${dateStr}-%` }
    }
  });

  const sequence = String(countToday + 1).padStart(4, '0'); // "0001", "0002", dst
  return `RM-${dateStr}-${sequence}`;
}

// GET /patients?page=1&limit=10&search=budi
exports.getPatients = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit; // rumus buat "lompat" ke halaman yang benar
    const search = req.query.search || '';

    const { count, rows } = await Patient.findAndCountAll({
      where: search
        ? {
            // cari di beberapa kolom sekaligus pakai OR
            [Op.or]: [
              { nama: { [Op.iLike]: `%${search}%` } }, // iLike = LIKE tapi case-insensitive (khusus postgres)
              { nik: { [Op.iLike]: `%${search}%` } },
              { no_rm: { [Op.iLike]: `%${search}%` } }
            ]
          }
        : {},
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    return res.status(200).json({
      success: true,
      message: 'Success',
      data: {
        patients: rows,
        pagination: {
          total: count,
          page,
          limit,
          totalPages: Math.ceil(count / limit)
        }
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server', errors: { detail: err.message } });
  }
};

// GET /patients/:id
exports.getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findByPk(req.params.id); // findByPk = cari berdasarkan Primary Key
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Pasien tidak ditemukan', errors: {} });
    }
    return res.status(200).json({ success: true, message: 'Success', data: patient });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server', errors: { detail: err.message } });
  }
};

// POST /patients
exports.createPatient = async (req, res) => {
  try {
    const { nik, nama, jenis_kelamin, tanggal_lahir, no_telp, alamat } = req.body;

    // validasi manual sederhana (nanti bisa diganti pakai library kayak Joi/express-validator)
    const errors = {};
    if (!nik) errors.nik = 'NIK wajib diisi';
    if (!nama) errors.nama = 'Nama wajib diisi';
    if (!jenis_kelamin) errors.jenis_kelamin = 'Jenis kelamin wajib diisi';
    if (!tanggal_lahir) errors.tanggal_lahir = 'Tanggal lahir wajib diisi';

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ success: false, message: 'Validation Error', errors });
    }

    // cek NIK duplikat SEBELUM insert, biar pesan errornya jelas
    // (meskipun kolom nik juga sudah unique di level database sebagai pengaman kedua)
    const existing = await Patient.findOne({ where: { nik } });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: { nik: 'NIK sudah terdaftar' }
      });
    }

    const no_rm = await generateNoRM();

    const patient = await Patient.create({
      no_rm, nik, nama, jenis_kelamin, tanggal_lahir, no_telp, alamat
    });

    return res.status(201).json({ success: true, message: 'Success', data: patient });
  } catch (err) {
    // race condition safety net: kalau 2 request barengan lolos pengecekan manual di atas,
    // unique constraint di database bakal nolak salah satunya lewat error ini
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ success: false, message: 'Validation Error', errors: { nik: 'NIK sudah terdaftar' } });
    }
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server', errors: { detail: err.message } });
  }
};

// PUT /patients/:id
exports.updatePatient = async (req, res) => {
  try {
    const patient = await Patient.findByPk(req.params.id);
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Pasien tidak ditemukan', errors: {} });
    }

    const { nik, nama, jenis_kelamin, tanggal_lahir, no_telp, alamat } = req.body;

    // kalau NIK diubah, cek dulu NIK baru itu bentrok sama pasien lain apa nggak
    if (nik && nik !== patient.nik) {
      const existing = await Patient.findOne({ where: { nik } });
      if (existing) {
        return res.status(400).json({ success: false, message: 'Validation Error', errors: { nik: 'NIK sudah terdaftar' } });
      }
    }

    await patient.update({ nik, nama, jenis_kelamin, tanggal_lahir, no_telp, alamat });

    return res.status(200).json({ success: true, message: 'Success', data: patient });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server', errors: { detail: err.message } });
  }
};

// DELETE /patients/:id
exports.deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findByPk(req.params.id);
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Pasien tidak ditemukan', errors: {} });
    }
    await patient.destroy();
    return res.status(200).json({ success: true, message: 'Success', data: {} });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server', errors: { detail: err.message } });
  }
};