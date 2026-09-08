const express = require('express');
const router = express.Router();

const registrationController = require('../controllers/registrationController');
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');

router.use(verifyToken);

router.get('/', registrationController.getRegistrations);


router.post(
  '/',
  checkRole(['administrator', 'petugas_pendaftaran']),
  registrationController.createRegistration
);

router.put(
  '/:id',
  checkRole(['administrator', 'petugas_pendaftaran']),
  registrationController.updateRegistration
);

module.exports = router;