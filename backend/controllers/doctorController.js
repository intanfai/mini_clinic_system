const { Doctor, User, Poli } = require('../models');
const { Op } = require('sequelize');

// GET /doctors
exports.getDoctors = async (req, res) => {
  try {
    const search = req.query.search || '';

    const doctors = await Doctor.findAll({
      where: search
        ? {
            nama_dokter: {
              [Op.iLike]: `%${search}%`,
            },
          }
        : {},
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'email', 'role'],
        },
        {
          model: Poli,
          attributes: ['id', 'nama_poli'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    return res.status(200).json({
      success: true,
      message: 'Success',
      data: doctors,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server',
      errors: {
        detail: err.message,
      },
    });
  }
};

// GET /doctors/:id
exports.getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'email', 'role'],
        },
        {
          model: Poli,
          attributes: ['id', 'nama_poli'],
        },
      ],
    });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Dokter tidak ditemukan',
        errors: {},
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Success',
      data: doctor,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server',
      errors: {
        detail: err.message,
      },
    });
  }
};

// POST /doctors
exports.createDoctor = async (req, res) => {
  try {
    const {
      user_id,
      poli_id,
      nama_dokter,
    } = req.body;

    const errors = {};

    if (!user_id) errors.user_id = 'User wajib dipilih';
    if (!poli_id) errors.poli_id = 'Poli wajib dipilih';
    if (!nama_dokter) errors.nama_dokter = 'Nama dokter wajib diisi';

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors,
      });
    }

    // Pastikan user ada
    const user = await User.findByPk(user_id);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: {
          user_id: 'User tidak ditemukan',
        },
      });
    }

    // User dokter harus memiliki role dokter
    if (user.role !== 'dokter') {
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: {
          user_id: 'User yang dipilih harus memiliki role dokter',
        },
      });
    }

    // Pastikan poli ada
    const poli = await Poli.findByPk(poli_id);

    if (!poli) {
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: {
          poli_id: 'Poli tidak ditemukan',
        },
      });
    }

    // Satu user dokter hanya boleh punya satu data Doctor
    const existingDoctor = await Doctor.findOne({
      where: { user_id },
    });

    if (existingDoctor) {
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: {
          user_id: 'User tersebut sudah terdaftar sebagai dokter',
        },
      });
    }

    const doctor = await Doctor.create({
      user_id,
      poli_id,
      nama_dokter,
    });

    const result = await Doctor.findByPk(doctor.id, {
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'email', 'role'],
        },
        {
          model: Poli,
          attributes: ['id', 'nama_poli'],
        },
      ],
    });

    return res.status(201).json({
      success: true,
      message: 'Dokter berhasil ditambahkan',
      data: result,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server',
      errors: {
        detail: err.message,
      },
    });
  }
};

// PUT /doctors/:id
exports.updateDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByPk(req.params.id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Dokter tidak ditemukan',
        errors: {},
      });
    }

    const {
      poli_id,
      nama_dokter,
    } = req.body;

    const errors = {};

    if (!poli_id) errors.poli_id = 'Poli wajib dipilih';
    if (!nama_dokter) errors.nama_dokter = 'Nama dokter wajib diisi';

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors,
      });
    }

    const poli = await Poli.findByPk(poli_id);

    if (!poli) {
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: {
          poli_id: 'Poli tidak ditemukan',
        },
      });
    }

    await doctor.update({
      poli_id,
      nama_dokter,
    });

    return res.status(200).json({
      success: true,
      message: 'Dokter berhasil diubah',
      data: doctor,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server',
      errors: {
        detail: err.message,
      },
    });
  }
};

// DELETE /doctors/:id
exports.deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByPk(req.params.id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Dokter tidak ditemukan',
        errors: {},
      });
    }

    await doctor.destroy();

    return res.status(200).json({
      success: true,
      message: 'Dokter berhasil dihapus',
      data: {},
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server',
      errors: {
        detail: err.message,
      },
    });
  }
};