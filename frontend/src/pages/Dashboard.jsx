import { useEffect, useState } from "react";

import {
  Users,
  CalendarDays,
  Ticket,
  Clock3,
  CheckCircle2,
  Stethoscope,
  ClipboardList,
} from "lucide-react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import api from "../services/api";
import Sidebar from "../components/Sidebar";
import { getCurrentUser } from "../utils/auth";

function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = getCurrentUser();
  const role = user?.role;

  useEffect(() => {
    getDashboard();
  }, []);

  const getDashboard = async () => {
    try {
      setLoading(true);

      const response = await api.get("/dashboard");

      setDashboard(response.data.data);
    } catch (error) {
      console.error(
        "Gagal mengambil dashboard:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Gagal mengambil data dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  const getRoleName = () => {
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

  const getDescription = () => {
    if (role === "administrator") {
      return "Pantau seluruh aktivitas dan pelayanan klinik.";
    }

    if (role === "dokter") {
      return "Pantau pasien dan aktivitas pemeriksaan hari ini.";
    }

    if (role === "petugas_pendaftaran") {
      return "Pantau pendaftaran dan antrean pasien hari ini.";
    }

    return "Ringkasan aktivitas Mini Clinic.";
  };

  if (loading) {
    return (
      <>
        <Sidebar />

        <main>
          <p>Memuat dashboard...</p>
        </main>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Sidebar />

        <main>
          <p>{error}</p>
        </main>
      </>
    );
  }

  /*
    CARD BERBEDA BERDASARKAN ROLE
  */

  let cards = [];

  if (role === "administrator") {
    cards = [
      {
        title: "Total Pasien",
        value: dashboard.total_pasien,
        icon: Users,
      },
      {
        title: "Pasien Hari Ini",
        value: dashboard.total_pasien_hari_ini,
        icon: CalendarDays,
      },
      {
        title: "Antrean Hari Ini",
        value: dashboard.total_antrean_hari_ini,
        icon: Ticket,
      },
      {
        title: "Menunggu",
        value: dashboard.total_pasien_menunggu,
        icon: Clock3,
      },
      {
        title: "Selesai",
        value: dashboard.total_pasien_selesai,
        icon: CheckCircle2,
      },
    ];
  }

  if (role === "dokter") {
    cards = [
      {
        title: "Total Pasien",
        value: dashboard.total_pasien,
        icon: Users,
      },
      {
        title: "Pasien Hari Ini",
        value: dashboard.total_pasien_hari_ini,
        icon: Stethoscope,
      },
      {
        title: "Menunggu Pemeriksaan",
        value: dashboard.total_pasien_menunggu,
        icon: Clock3,
      },
      {
        title: "Selesai Dilayani",
        value: dashboard.total_pasien_selesai,
        icon: CheckCircle2,
      },
    ];
  }

  if (role === "petugas_pendaftaran") {
    cards = [
      {
        title: "Total Pasien",
        value: dashboard.total_pasien,
        icon: Users,
      },
      {
        title: "Pendaftaran Hari Ini",
        value: dashboard.total_pasien_hari_ini,
        icon: ClipboardList,
      },
      {
        title: "Antrean Hari Ini",
        value: dashboard.total_antrean_hari_ini,
        icon: Ticket,
      },
      {
        title: "Pasien Menunggu",
        value: dashboard.total_pasien_menunggu,
        icon: Clock3,
      },
    ];
  }

  const chartData = [
    {
      name: "Menunggu",
      jumlah: dashboard.total_pasien_menunggu,
    },
    {
      name: "Selesai",
      jumlah: dashboard.total_pasien_selesai,
    },
  ];

  return (
    <>
      <Sidebar />

      <main>
        {/* HEADER */}
        <div className="dashboard-heading">
          <div>
            <h1>Dashboard</h1>

            <p>{getDescription()}</p>
          </div>

          <div className="role-badge">
            {getRoleName()}
          </div>
        </div>

        {/* CARD */}
        <div className="dashboard-cards">
          {cards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                className="dashboard-card"
                key={card.title}
              >
                <div className="dashboard-card-header">
                  <div className="dashboard-card-icon">
                    <Icon
                      size={21}
                      strokeWidth={1.8}
                    />
                  </div>

                  <span className="dashboard-card-title">
                    {card.title}
                  </span>
                </div>

                <div className="dashboard-card-value">
                  {card.value ?? 0}
                </div>
              </div>
            );
          })}
        </div>

        {/* CHART */}
        <div className="dashboard-chart">
          <div className="dashboard-chart-header">
            <h2>Status Pelayanan</h2>

            <p>
              Perbandingan pasien menunggu dan
              selesai dilayani.
            </p>
          </div>

          <div className="chart-container">
            <ResponsiveContainer
              width="100%"
              height={300}
            >
              <BarChart data={chartData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                />

                <XAxis dataKey="name" />

                <YAxis allowDecimals={false} />

                <Tooltip />

                <Bar
                  dataKey="jumlah"
                  fill="#1f4d3d"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
    </>
  );
}

export default Dashboard;