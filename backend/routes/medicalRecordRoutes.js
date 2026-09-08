const express = require('express');
const router = express.Router();

const medicalRecordController = require('../controllers/medicalRecordController');
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');

router.use(verifyToken);

// GET riwayat rekam medis pasien
router.get(
  '/patient/:patientId',
  medicalRecordController.getMedicalRecordsByPatient
);

// POST rekam medis
router.post(
  '/',
  checkRole(['administrator', 'dokter']),
  medicalRecordController.createMedicalRecord
);

module.exports = router;