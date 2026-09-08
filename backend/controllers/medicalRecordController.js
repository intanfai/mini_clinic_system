const { MedicalRecord, Registration } = require('../models');

exports.createMedicalRecord = async (req, res) => {
  try {
    const {
      registration_id,
      keluhan,
      tekanan_darah,
      suhu_tubuh,
      berat_badan,
      tinggi_badan,
      diagnosa,
      rencana_terapi,
      tindakan_medis
    } = req.body;

    const errors = {};

    if (!registration_id) {
      errors.registration_id = 'Registration ID wajib diisi';
    }

    if (!keluhan) {
      errors.keluhan = 'Keluhan wajib diisi';
    }

    if (!diagnosa) {
      errors.diagnosa = 'Diagnosa wajib diisi';
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors
      });
    }

    // Cek registration
    const registration = await Registration.findByPk(registration_id);

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Pendaftaran tidak ditemukan',
        errors: {}
      });
    }

    // Cek apakah registration sudah punya rekam medis
    const existingRecord = await MedicalRecord.findOne({
      where: { registration_id }
    });

    if (existingRecord) {
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: {
          registration_id: 'Pendaftaran sudah memiliki rekam medis'
        }
      });
    }

    const medicalRecord = await MedicalRecord.create({
      registration_id,
      keluhan,
      tekanan_darah,
      suhu_tubuh,
      berat_badan,
      tinggi_badan,
      diagnosa,
      rencana_terapi,
      tindakan_medis
    });

    return res.status(201).json({
      success: true,
      message: 'Success',
      data: medicalRecord
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


exports.getMedicalRecordsByPatient = async (req, res) => {
  try {
    const { patientId } = req.params;

    const records = await MedicalRecord.findAll({
      include: [
        {
          model: Registration,
          where: {
            patient_id: patientId
          }
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    return res.status(200).json({
      success: true,
      message: 'Success',
      data: records
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