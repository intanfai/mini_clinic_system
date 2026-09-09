import { useEffect, useState } from "react";
import api from "../services/api";
import Sidebar from "../components/Sidebar";

function MedicalRecords() {
  const [patients, setPatients] = useState([]);
  const [records, setRecords] = useState([]);

  const [patientId, setPatientId] = useState("");
  const [registrationId, setRegistrationId] = useState("");

  const [form, setForm] = useState({
    keluhan: "",
    tekanan_darah: "",
    suhu_tubuh: "",
    berat_badan: "",
    tinggi_badan: "",
    diagnosa: "",
    rencana_terapi: "",
    tindakan_medis: "",
  });

  const [loading, setLoading] = useState(false);

  // Ambil daftar pasien
  const getPatients = async () => {
    try {
      const response = await api.get("/patients?page=1&limit=100");
      setPatients(response.data.data?.patients || []);
    } catch (error) {
      console.error("Gagal mengambil pasien:", error);
    }
  };

  // Ambil riwayat rekam medis
  const getMedicalRecords = async (id) => {
    if (!id) {
      setRecords([]);
      return;
    }

    try {
      const response = await api.get(`/medical-records/${id}`);
      setRecords(response.data.data || []);
    } catch (error) {
      console.error("Gagal mengambil rekam medis:", error);
      setRecords([]);
    }
  };

  useEffect(() => {
    getPatients();
  }, []);

  const handlePatientChange = (e) => {
    const id = e.target.value;

    setPatientId(id);
    setRegistrationId("");

    getMedicalRecords(id);
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!registrationId) {
      alert("Pilih ID pendaftaran terlebih dahulu.");
      return;
    }

    try {
      setLoading(true);

      await api.post("/medical-records", {
        registration_id: Number(registrationId),
        ...form,
      });

      alert("Rekam medis berhasil disimpan.");

      setForm({
        keluhan: "",
        tekanan_darah: "",
        suhu_tubuh: "",
        berat_badan: "",
        tinggi_badan: "",
        diagnosa: "",
        rencana_terapi: "",
        tindakan_medis: "",
      });

      getMedicalRecords(patientId);
    } catch (error) {
      console.error("Gagal menyimpan rekam medis:", error);

      alert(
        error.response?.data?.message ||
          "Gagal menyimpan rekam medis."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Sidebar />

      <main>
        <h1>Rekam Medis</h1>
        <p>Kelola rekam medis pasien.</p>

        <hr />

        <h2>Input Rekam Medis</h2>

        <form onSubmit={handleSubmit}>
          <div>
            <label>Pasien</label>
            <br />
            <select
              value={patientId}
              onChange={handlePatientChange}
              required
            >
              <option value="">-- Pilih Pasien --</option>

              {patients.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.no_rm} - {patient.nama}
                </option>
              ))}
            </select>
          </div>

          <br />

          <div>
            <label>ID Pendaftaran</label>
            <br />
            <input
              type="number"
              value={registrationId}
              onChange={(e) => setRegistrationId(e.target.value)}
              placeholder="Contoh: 1"
              required
            />
          </div>

          <br />

          <div>
            <label>Keluhan</label>
            <br />
            <textarea
              name="keluhan"
              value={form.keluhan}
              onChange={handleChange}
              required
            />
          </div>

          <br />

          <div>
            <label>Tekanan Darah</label>
            <br />
            <input
              type="text"
              name="tekanan_darah"
              value={form.tekanan_darah}
              onChange={handleChange}
              placeholder="120/80"
            />
          </div>

          <br />

          <div>
            <label>Suhu Tubuh</label>
            <br />
            <input
              type="text"
              name="suhu_tubuh"
              value={form.suhu_tubuh}
              onChange={handleChange}
              placeholder="36.5"
            />
          </div>

          <br />

          <div>
            <label>Berat Badan</label>
            <br />
            <input
              type="text"
              name="berat_badan"
              value={form.berat_badan}
              onChange={handleChange}
              placeholder="60"
            />
          </div>

          <br />

          <div>
            <label>Tinggi Badan</label>
            <br />
            <input
              type="text"
              name="tinggi_badan"
              value={form.tinggi_badan}
              onChange={handleChange}
              placeholder="165"
            />
          </div>

          <br />

          <div>
            <label>Diagnosa</label>
            <br />
            <textarea
              name="diagnosa"
              value={form.diagnosa}
              onChange={handleChange}
              required
            />
          </div>

          <br />

          <div>
            <label>Rencana Terapi</label>
            <br />
            <textarea
              name="rencana_terapi"
              value={form.rencana_terapi}
              onChange={handleChange}
            />
          </div>

          <br />

          <div>
            <label>Tindakan Medis</label>
            <br />
            <textarea
              name="tindakan_medis"
              value={form.tindakan_medis}
              onChange={handleChange}
            />
          </div>

          <br />

          <button type="submit" disabled={loading}>
            {loading ? "Menyimpan..." : "Simpan Rekam Medis"}
          </button>
        </form>

        <hr />

        <h2>Riwayat Rekam Medis</h2>

        {!patientId ? (
          <p>Pilih pasien untuk melihat riwayat.</p>
        ) : records.length === 0 ? (
          <p>Belum ada rekam medis.</p>
        ) : (
          <table border="1">
            <thead>
              <tr>
                <th>No</th>
                <th>Keluhan</th>
                <th>Tekanan Darah</th>
                <th>Suhu</th>
                <th>Berat</th>
                <th>Tinggi</th>
                <th>Diagnosa</th>
                <th>Rencana Terapi</th>
                <th>Tindakan</th>
              </tr>
            </thead>

            <tbody>
              {records.map((record, index) => (
                <tr key={record.id}>
                  <td>{index + 1}</td>
                  <td>{record.keluhan}</td>
                  <td>{record.tekanan_darah || "-"}</td>
                  <td>{record.suhu_tubuh || "-"}</td>
                  <td>{record.berat_badan || "-"}</td>
                  <td>{record.tinggi_badan || "-"}</td>
                  <td>{record.diagnosa}</td>
                  <td>{record.rencana_terapi || "-"}</td>
                  <td>{record.tindakan_medis || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
}

export default MedicalRecords;