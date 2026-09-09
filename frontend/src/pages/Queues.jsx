import { useEffect, useState } from "react";
import api from "../services/api";
import Sidebar from "../components/Sidebar";

function Queues() {
  const [queues, setQueues] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [registrationId, setRegistrationId] = useState("");

  const getQueues = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/queues");

      console.log("Data antrean:", response.data);

      setQueues(response.data.data || []);
    } catch (error) {
      console.error("Gagal mengambil data antrean:", error);

      setError(error.response?.data?.message || "Gagal mengambil data antrean.");
    } finally {
      setLoading(false);
    }
  };

  const getRegistrations = async () => {
    try {
      const response = await api.get("/registrations");

      console.log("Data pendaftaran:", response.data);

      setRegistrations(response.data.data || []);
    } catch (error) {
      console.error("Gagal mengambil data pendaftaran:", error);
    }
  };

  useEffect(() => {
    getQueues();
    getRegistrations();
  }, []);

  const handleCreateQueue = async (e) => {
    e.preventDefault();

    try {
      await api.post("/queues", {
        registration_id: Number(registrationId),
      });

      alert("Antrean berhasil dibuat.");

      setRegistrationId("");
      setShowForm(false);

      getQueues();
    } catch (error) {
      console.error("Gagal membuat antrean:", error);
      console.log("Detail error:", error.response?.data);

      alert(error.response?.data?.errors?.registration_id || error.response?.data?.message || "Gagal membuat antrean.");
    }
  };

  const handleCallQueue = async (queueId) => {
    try {
      await api.put(`/queues/${queueId}/call`);

      alert("Antrean berhasil dipanggil.");

      getQueues();
    } catch (error) {
      console.error("Gagal memanggil antrean:", error);

      alert(error.response?.data?.message || "Gagal memanggil antrean.");
    }
  };

  const handleCompleteQueue = async (queueId) => {
    try {
      await api.put(`/queues/${queueId}/status`, {
        status: "selesai",
      });

      alert("Antrean berhasil diselesaikan.");

      getQueues();
    } catch (error) {
      console.error("Gagal menyelesaikan antrean:", error);

      alert(error.response?.data?.message || "Gagal menyelesaikan antrean.");
    }
  };

  return (
    <div>
      <Sidebar />

      <main>
        <h1>Antrean</h1>

        <p>Kelola antrean pasien hari ini.</p>

        <button onClick={() => setShowForm(!showForm)}>{showForm ? "Tutup Form" : "+ Buat Antrean"}</button>

        {showForm && (
          <form onSubmit={handleCreateQueue}>
            <h2>Buat Antrean</h2>

            <div>
              <label>Pendaftaran</label>

              <br />

              <select value={registrationId} onChange={(e) => setRegistrationId(e.target.value)} required>
                <option value="">-- Pilih Pendaftaran --</option>

                {registrations.map((registration) => (
                  <option key={registration.id} value={registration.id}>
                    {registration.Patient?.nama || "-"} - {registration.Doctor?.nama_dokter || "-"} - {registration.Poli?.nama_poli || "-"} - {registration.tanggal_kunjungan}
                  </option>
                ))}
              </select>
            </div>

            <br />

            <button type="submit">Simpan Antrean</button>
          </form>
        )}

        <hr />

        {loading && <p>Memuat data antrean...</p>}

        {error && <p>{error}</p>}

        {!loading && !error && (
          <>
            {queues.length === 0 ? (
              <p>Belum ada data antrean.</p>
            ) : (
              <table border="1">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Nomor Antrean</th>
                    <th>Pasien</th>
                    <th>Dokter</th>
                    <th>Poli</th>
                    <th>Status</th>
                    <th>Aksi</th>
                  </tr>
                </thead>

                <tbody>
                  {queues.map((queue, index) => (
                    <tr key={queue.id}>
                      <td>{index + 1}</td>

                      <td>{queue.nomor_antrean}</td>

                      <td>{queue.Registration?.Patient?.nama || "-"}</td>

                      <td>{queue.Registration?.Doctor?.nama_dokter || "-"}</td>

                      <td>{queue.Registration?.Poli?.nama_poli || "-"}</td>

                      <td>{queue.status}</td>

                      <td>
                        {queue.status === "menunggu" && <button onClick={() => handleCallQueue(queue.id)}>Panggil</button>}

                        {queue.status === "dipanggil" && <button onClick={() => handleCompleteQueue(queue.id)}>Selesai</button>}

                        {queue.status === "selesai" && <span>-</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default Queues;
