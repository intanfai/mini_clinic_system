const express = require("express");
const router = express.Router();

const reportController = require("../controllers/reportController");
const { verifyToken } = require("../middlewares/authMiddleware");

router.get("/visits", verifyToken, reportController.getVisitReport);

module.exports = router;
