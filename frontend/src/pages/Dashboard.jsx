import { useEffect, useState } from "react";
import api from "../services/api";
import Sidebar from "../components/Sidebar";

function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const getDashboard = async () => {
      try {
        const response = await api.get("/dashboard");

        console.log("Data dashboard:", response.data);

        setDashboard(response.data.data);
      } catch (error) {
        console.error("Gagal mengambil data dashboard:", error);

        setError(
          error.response?.data?.message ||
            "Gagal mengambil data dashboard."
        );
      } finally {
        setLoading(false);
      }
    };

    getDashboard();
  }, []);

  if (loading) {
    return <p>Memuat dashboard...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <Sidebar />

      <main>
        <h1>Dashboard</h1>

        <p>Selamat datang di Mini Clinic System.</p>

        <div>
          <h3>Total Pasien</h3>
          <p>{dashboard.total_pasien}</p>
        </div>

        <div>
          <h3>Pasien Hari Ini</h3>
          <p>{dashboard.total_pasien_hari_ini}</p>
        </div>

        <div>
          <h3>Antrean Hari Ini</h3>
          <p>{dashboard.total_antrean_hari_ini}</p>
        </div>

        <div>
          <h3>Pasien Menunggu</h3>
          <p>{dashboard.total_pasien_menunggu}</p>
        </div>

        <div>
          <h3>Pasien Selesai</h3>
          <p>{dashboard.total_pasien_selesai}</p>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;