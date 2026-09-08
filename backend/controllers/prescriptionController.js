const { Prescription, MedicalRecord } = require('../models');

exports.createPrescription = async (req, res) => {
  try {
    const {
      medical_record_id,
      nama_obat,
      dosis,
      jumlah,
      aturan_pakai
    } = req.body;

    const errors = {};

    if (!medical_record_id) {
      errors.medical_record_id = 'Medical Record ID wajib diisi';
    }

    if (!nama_obat) {
      errors.nama_obat = 'Nama obat wajib diisi';
    }

    if (!dosis) {
      errors.dosis = 'Dosis wajib diisi';
    }

    if (!jumlah) {
      errors.jumlah = 'Jumlah obat wajib diisi';
    }

    if (!aturan_pakai) {
      errors.aturan_pakai = 'Aturan pakai wajib diisi';
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors
      });
    }

    // Cek apakah medical record ada
    const medicalRecord = await MedicalRecord.findByPk(medical_record_id);

    if (!medicalRecord) {
      return res.status(404).json({
        success: false,
        message: 'Rekam medis tidak ditemukan',
        errors: {}
      });
    }

    const prescription = await Prescription.create({
      medical_record_id,
      nama_obat,
      dosis,
      jumlah,
      aturan_pakai
    });

    return res.status(201).json({
      success: true,
      message: 'Success',
      data: prescription
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


exports.getPrescriptionById = async (req, res) => {
  try {
    const prescription = await Prescription.findByPk(req.params.id, {
      include: [
        {
          model: MedicalRecord
        }
      ]
    });

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: 'Resep tidak ditemukan',
        errors: {}
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Success',
      data: prescription
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