const express = require('express');
const router = express.Router();

const doctorController = require('../controllers/doctorController');
const {
  verifyToken,
  checkRole,
} = require('../middlewares/authMiddleware');

// Semua endpoint dokter wajib login
router.use(verifyToken);

// Semua role boleh melihat daftar/detail dokter
router.get('/', doctorController.getDoctors);
router.get('/:id', doctorController.getDoctorById);

// Hanya admin yang boleh mengelola master dokter
router.post(
  '/',
  checkRole(['administrator']),
  doctorController.createDoctor
);

router.put(
  '/:id',
  checkRole(['administrator']),
  doctorController.updateDoctor
);

router.delete(
  '/:id',
  checkRole(['administrator']),
  doctorController.deleteDoctor
);

module.exports = router;