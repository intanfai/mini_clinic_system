const express = require('express');

const router = express.Router();

const queueController = require('../controllers/queueController');

const { verifyToken, checkRole } = require('../middlewares/authMiddleware');

router.use(verifyToken);

// GET semua antrean
router.get('/', queueController.getQueues);

// POST buat nomor antrean
router.post(
  '/',
  checkRole(['administrator', 'petugas_pendaftaran']),
  queueController.createQueue
);

// PUT panggil antrean berdasarkan ID
router.put(
  '/:id/call',
  checkRole(['administrator', 'petugas_pendaftaran']),
  queueController.callQueue
);

// PUT update status antrean
router.put(
  '/:id/status',
  checkRole(['administrator', 'petugas_pendaftaran']),
  queueController.updateQueueStatus
);

module.exports = router;