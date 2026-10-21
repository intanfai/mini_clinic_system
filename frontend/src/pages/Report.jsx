import { useEffect, useState } from "react";
import {
  CalendarDays,
  Download,
  RefreshCw,
  ChartColumn,
  Building2,
  CheckCircle2,
  Clock3,
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
import "./Report.css";

function getLocalDate() {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

function getDefaultStartDate() {
  const date = new Date();
  date.setDate(date.getDate() - 30);
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

function formatDate(date) {
  if (!date) return "-";
  return new Date(`${date}T00:00:00`).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function Report() {
  const [startDate, setStartDate] = useState(getDefaultStartDate);
  const [endDate, setEndDate] = useState(getLocalDate);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [appliedPeriod, setAppliedPeriod] = useState(null);

  const loadReport = async (from = startDate, to = endDate) => {
    if (!from || !to) {
      setError("Tanggal mulai dan tanggal akhir wajib diisi.");
      return;
    }

    if (from > to) {
      setError("Tanggal mulai tidak boleh melebihi tanggal akhir.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await api.get("/reports/visits", {
        params: { startDate: from, endDate: to },
      });

      setReport(response.data.data);
      setAppliedPeriod({ from, to });
    } catch (err) {
      console.error("Gagal mengambil laporan:", err);
      setError(
        err.response?.data?.message ||
          "Gagal mengambil laporan. Periksa koneksi backend."
      );
      setReport(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReport();
  }, []);

  const exportCSV = () => {
    if (!report) return;

    const rows = [
      ["LAPORAN KUNJUNGAN KLINIK"],
      ["Periode", report.periode.mulai, "sampai", report.periode.selesai],
      [],
      ["RINGKASAN"],
      ["Total kunjungan", report.ringkasan.total_kunjungan],
      ["Kunjungan selesai", report.ringkasan.kunjungan_selesai],
      ["Kunjungan belum selesai", report.ringkasan.kunjungan_belum_selesai],
      [],
      ["KUNJUNGAN HARIAN"],
      ["Tanggal", "Total Kunjungan", "Kunjungan Selesai"],
      ...report.harian.map((item) => [
        item.tanggal,
        item.total,
        item.selesai,
      ]),
      [],
      ["KUNJUNGAN PER POLI"],
      ["Nama Poli", "Total Kunjungan", "Kunjungan Selesai"],
      ...report.per_poli.map((item) => [
        item.nama_poli,
        item.total,
        item.selesai,
      ]),
    ];

    const csv = rows
      .map((row) =>
        row
          .map((cell) => {
            const value = String(cell ?? "");
            return `"${value.replace(/"/g, '""')}"`;
          })
          .join(",")
      )
      .join("\r\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `laporan-kunjungan-${report.periode.mulai}-${report.periode.selesai}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const summary = report?.ringkasan;

  return (
    <>
      <Sidebar />

      <main className="report-page">
        <div className="dashboard-heading">
          <div>
            <h1>Laporan Kunjungan</h1>
            <p>Ringkasan kunjungan dan pelayanan klinik berdasarkan periode.</p>
          </div>

          <span className="role-badge">
            <ChartColumn size={16} />
            Laporan
          </span>
        </div>

        <section className="page-section report-filter">
          <div className="report-section-title">
            <CalendarDays size={20} />
            <h2>Filter Periode</h2>
          </div>

          <form
            className="report-filter-form"
            onSubmit={(event) => {
              event.preventDefault();
              loadReport();
            }}
          >
            <div>
              <label htmlFor="report-start">Tanggal mulai</label>
              <input
                id="report-start"
                type="date"
                value={startDate}
                max={endDate || undefined}
                onChange={(event) => setStartDate(event.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="report-end">Tanggal akhir</label>
              <input
                id="report-end"
                type="date"
                value={endDate}
                min={startDate || undefined}
                onChange={(event) => setEndDate(event.target.value)}
                required
              />
            </div>

            <button type="submit" disabled={loading}>
              <RefreshCw size={16} />
              {loading ? "Memuat..." : "Tampilkan"}
            </button>

            <button
              type="button"
              className="report-export-button"
              onClick={exportCSV}
              disabled={!report || loading}
            >
              <Download size={16} />
              Ekspor CSV
            </button>
          </form>

          {appliedPeriod && (
            <p className="report-period">
              Periode laporan: {formatDate(appliedPeriod.from)} –{" "}
              {formatDate(appliedPeriod.to)}
            </p>
          )}
        </section>

        {error && <div className="error-message">{error}</div>}

        {loading && (
          <div className="page-section empty-state">Memuat laporan...</div>
        )}

        {!loading && report && (
          <>
            <div className="dashboard-cards report-summary">
              <div className="dashboard-card">
                <div className="dashboard-card-header">
                  <div className="dashboard-card-icon">
                    <CalendarDays size={21} />
                  </div>
                  <span className="dashboard-card-title">Total Kunjungan</span>
                </div>
                <div className="dashboard-card-value">
                  {summary.total_kunjungan}
                </div>
              </div>

              <div className="dashboard-card">
                <div className="dashboard-card-header">
                  <div className="dashboard-card-icon">
                    <CheckCircle2 size={21} />
                  </div>
                  <span className="dashboard-card-title">Kunjungan Selesai</span>
                </div>
                <div className="dashboard-card-value">
                  {summary.kunjungan_selesai}
                </div>
              </div>

              <div className="dashboard-card">
                <div className="dashboard-card-header">
                  <div className="dashboard-card-icon">
                    <Clock3 size={21} />
                  </div>
                  <span className="dashboard-card-title">
                    Belum Selesai
                  </span>
                </div>
                <div className="dashboard-card-value">
                  {summary.kunjungan_belum_selesai}
                </div>
              </div>
            </div>

            <section className="dashboard-chart report-chart">
              <div className="dashboard-chart-header">
                <h2>Tren Kunjungan Harian</h2>
                <p>Jumlah kunjungan dan yang selesai pada setiap tanggal.</p>
              </div>

              <div className="chart-container">
                {report.harian.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={report.harian}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis
                        dataKey="tanggal"
                        tickFormatter={(value) => value.slice(5)}
                        minTickGap={20}
                      />
                      <YAxis allowDecimals={false} />
                      <Tooltip
                        labelFormatter={(value) => formatDate(value)}
                      />
                      <Bar
                        dataKey="total"
                        name="Total kunjungan"
                        fill="#1f4d3d"
                        radius={[5, 5, 0, 0]}
                      />
                      <Bar
                        dataKey="selesai"
                        name="Kunjungan selesai"
                        fill="#c1443d"
                        radius={[5, 5, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="empty-state">Belum ada data harian.</div>
                )}
              </div>
            </section>

            <section className="dashboard-chart report-chart">
              <div className="report-section-title">
                <Building2 size={20} />
                <h2>Kunjungan per Poli</h2>
              </div>

              {report.per_poli.length === 0 ? (
                <div className="empty-state">
                  Tidak ada kunjungan pada periode ini.
                </div>
              ) : (
                <div className="report-table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Nama Poli</th>
                        <th>Total Kunjungan</th>
                        <th>Selesai</th>
                      </tr>
                    </thead>
                    <tbody>
                      {report.per_poli.map((item) => (
                        <tr key={item.nama_poli}>
                          <td>{item.nama_poli}</td>
                          <td>{item.total}</td>
                          <td>{item.selesai}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </>
  );
}

export default Report;
