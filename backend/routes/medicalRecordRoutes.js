const express = require("express");
const router = express.Router();

const medicalRecordController = require("../controllers/medicalRecordController");
const { verifyToken, checkRole } = require("../middleware/authMiddleware");

router.use(verifyToken);

router.get("/:patientId", medicalRecordController.getMedicalRecordsByPatient);

router.post("/", checkRole(["administrator", "dokter"]), medicalRecordController.createMedicalRecord);

module.exports = router;
