import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import Registrations from "./pages/Registrations";
import Queues from "./pages/Queues";
import MedicalRecords from "./pages/MedicalRecords.jsx";
import Prescriptions from "./pages/Prescriptions";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/patients" element={<Patients />} />
        <Route path="/registrations" element={<Registrations />} />
        <Route path="/queues" element={<Queues />} />
        <Route path="/medical-records" element={<MedicalRecords />} />
        <Route path="/prescriptions" element={<Prescriptions />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
