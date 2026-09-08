const express = require('express');
const router = express.Router();

const prescriptionController = require('../controllers/prescriptionController');
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');

router.use(verifyToken);

router.post(
  '/',
  checkRole(['administrator', 'dokter']),
  prescriptionController.createPrescription
);

router.get(
  '/:id',
  prescriptionController.getPrescriptionById
);

module.exports = router;