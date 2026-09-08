const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');

// semua route pasien wajib login dulu
router.use(verifyToken);

router.get('/', patientController.getPatients);
router.get('/:id', patientController.getPatientById);
router.post('/', checkRole(['administrator', 'petugas_pendaftaran']), patientController.createPatient);
router.put('/:id', checkRole(['administrator', 'petugas_pendaftaran']), patientController.updatePatient);
router.delete('/:id', checkRole(['administrator']), patientController.deletePatient); // cuma admin yang boleh hapus

module.exports = router;