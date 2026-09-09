require("dotenv").config(); // load variabel dari .env, HARUS di paling atas
const express = require("express");
const cors = require("cors"); // biar frontend React (beda origin) bisa akses API ini

const app = express();

// middleware bawaan express buat parsing body JSON dari request
app.use(express.json());
app.use(cors());

// ==== DAFTARIN ROUTES DI SINI ====
const authRoutes = require("./routes/authRoutes");
app.use("/api", authRoutes);

const patientRoutes = require("./routes/patientRoutes");
app.use("/api/patients", patientRoutes);

const doctorRoutes = require("./routes/doctorRoutes");
app.use("/api/doctors", doctorRoutes);


const registrationRoutes = require("./routes/registrationRoutes");
app.use("/api/registrations", registrationRoutes);

const queueRoutes = require("./routes/queueRoutes");
app.use("/api/queues", queueRoutes);

const medicalRecordRoutes = require("./routes/medicalRecordRoutes");
app.use("/api/medical-records", medicalRecordRoutes);

const prescriptionRoutes = require("./routes/prescriptionRoutes");
app.use("/api/prescriptions", prescriptionRoutes);

const dashboardRoutes = require("./routes/dashboardRoutes");
app.use("/api/dashboard", dashboardRoutes);

module.exports = app;

