import { NavLink, useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <aside>
      <h2>Mini Clinic</h2>

      <nav>
        <NavLink to="/dashboard">
          Dashboard
        </NavLink>

        <NavLink to="/patients">
          Pasien
        </NavLink>

        <NavLink to="/registrations">
          Pendaftaran
        </NavLink>

        <NavLink to="/queues">
          Antrean
        </NavLink>

        <NavLink to="/medical-records">
          Rekam Medis
        </NavLink>

        <NavLink to="/prescriptions">
          Resep
        </NavLink>
      </nav>

      <button onClick={handleLogout}>
        Logout
      </button>
    </aside>
  );
}

export default Sidebar;