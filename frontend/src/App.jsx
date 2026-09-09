import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import Registrations from "./pages/Registrations";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/patients" element={<Patients />} />
        <Route path="/registrations"  element={<Registrations />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;