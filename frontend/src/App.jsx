import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import Registrations from "./pages/Registrations";
import Queues from "./pages/Queues";
import MedicalRecords from "./pages/MedicalRecords";
import Prescriptions from "./pages/Prescriptions";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* LOGIN */}
        <Route path="/" element={<Login />} />

        {/* DASHBOARD - SEMUA ROLE */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["administrator", "dokter", "petugas_pendaftaran"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* PASIEN - SEMUA ROLE */}
        <Route
          path="/patients"
          element={
            <ProtectedRoute allowedRoles={["administrator", "dokter", "petugas_pendaftaran"]}>
              <Patients />
            </ProtectedRoute>
          }
        />

        {/* PENDAFTARAN - ADMIN + PETUGAS */}
        <Route
          path="/registrations"
          element={
            <ProtectedRoute allowedRoles={["administrator", "petugas_pendaftaran"]}>
              <Registrations />
            </ProtectedRoute>
          }
        />

        {/* ANTREAN - ADMIN + PETUGAS */}
        <Route
          path="/queues"
          element={
            <ProtectedRoute allowedRoles={["administrator", "petugas_pendaftaran"]}>
              <Queues />
            </ProtectedRoute>
          }
        />

        {/* REKAM MEDIS - ADMIN + DOKTER */}
        <Route
          path="/medical-records"
          element={
            <ProtectedRoute allowedRoles={["administrator", "dokter"]}>
              <MedicalRecords />
            </ProtectedRoute>
          }
        />

        {/* RESEP - ADMIN + DOKTER */}
        <Route
          path="/prescriptions"
          element={
            <ProtectedRoute allowedRoles={["administrator", "dokter"]}>
              <Prescriptions />
            </ProtectedRoute>
          }
        />

        {/* URL TIDAK DIKENAL */}
        <Route
          path="*"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
