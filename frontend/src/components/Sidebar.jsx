import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, ClipboardList, Ticket, Stethoscope, Pill, LogOut, Plus } from "lucide-react";
import { getCurrentUser, logout } from "../utils/auth";

function Sidebar() {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const role = user?.role;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getRoleLabel = () => {
    if (role === "administrator") {
      return "Administrator";
    }

    if (role === "dokter") {
      return "Dokter";
    }

    if (role === "petugas_pendaftaran") {
      return "Petugas Pendaftaran";
    }

    return "Pengguna";
  };

  return (
    <aside className="sidebar">
      <div>
        {/* BRAND */}
        <div className="sidebar-brand">
          <div className="brand-icon">
            <Plus size={22} strokeWidth={2.5} />
          </div>

          <div>
            <h2>Mini Clinic</h2>
            <span>Clinic Management</span>
          </div>
        </div>

        {/* USER ROLE */}
        <div className="sidebar-user">
          <div className="sidebar-user-info">
            <span className="sidebar-user-label">Login sebagai</span>

            <strong>{getRoleLabel()}</strong>
          </div>
        </div>

        {/* NAVIGATION */}
        <nav className="sidebar-nav">
          {/* SEMUA ROLE */}
          <NavLink to="/dashboard" className="sidebar-link">
            <LayoutDashboard size={19} />
            <span>Dashboard</span>
          </NavLink>

          {/* SEMUA ROLE BOLEH MELIHAT PASIEN */}
          <NavLink to="/patients" className="sidebar-link">
            <Users size={19} />
            <span>Pasien</span>
          </NavLink>

          {/* ADMIN + PETUGAS */}
          {(role === "administrator" || role === "petugas_pendaftaran") && (
            <>
              <NavLink to="/registrations" className="sidebar-link">
                <ClipboardList size={19} />
                <span>Pendaftaran</span>
              </NavLink>

              <NavLink to="/queues" className="sidebar-link">
                <Ticket size={19} />
                <span>Antrean</span>
              </NavLink>
            </>
          )}

          {/* ADMIN + DOKTER */}
          {(role === "administrator" || role === "dokter") && (
            <>
              <NavLink to="/medical-records" className="sidebar-link">
                <Stethoscope size={19} />
                <span>Rekam Medis</span>
              </NavLink>

              <NavLink to="/prescriptions" className="sidebar-link">
                <Pill size={19} />
                <span>Resep</span>
              </NavLink>
            </>
          )}
        </nav>
      </div>

      {/* LOGOUT */}
      <button className="logout-button" onClick={handleLogout}>
        <LogOut size={19} />
        <span>Logout</span>
      </button>
    </aside>
  );
}

export default Sidebar;
