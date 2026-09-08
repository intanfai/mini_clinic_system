const { Registration, Patient, Doctor, Poli } = require("../models");

// GET /registrations
exports.getRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.findAll({
      include: [
        {
          model: Patient,
        },
        {
          model: Doctor,
        },
        {
          model: Poli,
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      message: "Success",
      data: registrations,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server",
      errors: { detail: err.message },
    });
  }
};

// POST /registrations
exports.createRegistration = async (req, res) => {
  try {
    const { patient_id, doctor_id, poli_id, tanggal_kunjungan, jenis_pembayaran, keluhan_awal } = req.body;

    const errors = {};

    if (!patient_id) errors.patient_id = "Pasien wajib dipilih";
    if (!doctor_id) errors.doctor_id = "Dokter wajib dipilih";
    if (!poli_id) errors.poli_id = "Poli wajib dipilih";
    if (!tanggal_kunjungan) errors.tanggal_kunjungan = "Tanggal kunjungan wajib diisi";
    if (!jenis_pembayaran) errors.jenis_pembayaran = "Jenis pembayaran wajib diisi";

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors,
      });
    }

    // cek pasien
    const patient = await Patient.findByPk(patient_id);
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Pasien tidak ditemukan",
        errors: {},
      });
    }

    // cek dokter
    const doctor = await Doctor.findByPk(doctor_id);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Dokter tidak ditemukan",
        errors: {},
      });
    }

    // cek poli
    const poli = await Poli.findByPk(poli_id);
    if (!poli) {
      return res.status(404).json({
        success: false,
        message: "Poli tidak ditemukan",
        errors: {},
      });
    }

    const registration = await Registration.create({
      patient_id,
      doctor_id,
      poli_id,
      tanggal_kunjungan,
      jenis_pembayaran,
      keluhan_awal,
      status: "menunggu",
    });

    return res.status(201).json({
      success: true,
      message: "Success",
      data: registration,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server",
      errors: { detail: err.message },
    });
  }
};

// PUT /registrations/:id
exports.updateRegistration = async (req, res) => {
  try {
    const registration = await Registration.findByPk(req.params.id);

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: "Pendaftaran tidak ditemukan",
        errors: {},
      });
    }

    const { patient_id, doctor_id, poli_id, tanggal_kunjungan, jenis_pembayaran, keluhan_awal, status } = req.body;

    const allowedStatus = ["menunggu", "checkin", "pemeriksaan", "selesai"];

    if (status && !allowedStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: {
          status: "Status tidak valid",
        },
      });
    }

    await registration.update({
      patient_id: patient_id ?? registration.patient_id,
      doctor_id: doctor_id ?? registration.doctor_id,
      poli_id: poli_id ?? registration.poli_id,
      tanggal_kunjungan: tanggal_kunjungan ?? registration.tanggal_kunjungan,
      jenis_pembayaran: jenis_pembayaran ?? registration.jenis_pembayaran,
      keluhan_awal: keluhan_awal ?? registration.keluhan_awal,
      status: status ?? registration.status,
    });

    return res.status(200).json({
      success: true,
      message: "Success",
      data: registration,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server",
      errors: { detail: err.message },
    });
  }
};
