import { useEffect, useState } from "react";
import api from "../services/api";
import Sidebar from "../components/Sidebar";

function Registrations() {
  const [registrations, setRegistrations] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    patient_id: "",
    doctor_id: "",
    poli_id: "",
    tanggal_kunjungan: "",
    jenis_pembayaran: "Umum",
    keluhan_awal: "",
  });

  const getRegistrations = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/registrations");

      console.log("Data pendaftaran:", response.data);

      setRegistrations(response.data.data);
    } catch (error) {
      console.error("Gagal mengambil data pendaftaran:", error);

      setError(error.response?.data?.message || "Gagal mengambil data pendaftaran.");
    } finally {
      setLoading(false);
    }
  };

  const getPatients = async () => {
    try {
      const response = await api.get("/patients", {
        params: {
          page: 1,
          limit: 100,
        },
      });

      console.log("Data pasien:", response.data);

      setPatients(response.data.data.patients);
    } catch (error) {
      console.error("Gagal mengambil data pasien:", error);
    }
  };

  const getDoctors = async () => {
    try {
      const response = await api.get("/doctors");

      console.log("Data dokter:", response.data);

      setDoctors(response.data.data);
    } catch (error) {
      console.error("Gagal mengambil data dokter:", error);
    }
  };

  useEffect(() => {
    getRegistrations();
    getPatients();
    getDoctors();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Kalau dokter berubah, poli otomatis mengikuti dokter
    if (name === "doctor_id") {
      const selectedDoctor = doctors.find((doctor) => doctor.id === Number(value));

      setForm((prev) => ({
        ...prev,
        doctor_id: value,
        poli_id: selectedDoctor?.poli_id || "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/registrations", {
        patient_id: Number(form.patient_id),
        doctor_id: Number(form.doctor_id),
        poli_id: Number(form.poli_id),
        tanggal_kunjungan: form.tanggal_kunjungan,
        jenis_pembayaran: form.jenis_pembayaran,
        keluhan_awal: form.keluhan_awal,
      });

      alert("Pendaftaran berhasil ditambahkan.");

      setForm({
        patient_id: "",
        doctor_id: "",
        poli_id: "",
        tanggal_kunjungan: "",
        jenis_pembayaran: "Umum",
        keluhan_awal: "",
      });

      setShowForm(false);

      getRegistrations();
    } catch (error) {
      console.error("Gagal menambahkan pendaftaran:", error);

      alert(error.response?.data?.message || "Gagal menambahkan pendaftaran.");
    }
  };

  const handleStatusChange = async (registrationId, newStatus) => {
    try {
      await api.put(`/registrations/${registrationId}`, {
        status: newStatus,
      });

      alert("Status pendaftaran berhasil diperbarui.");

      getRegistrations();
    } catch (error) {
      console.error("Gagal mengubah status:", error);

      alert(error.response?.data?.message || "Gagal mengubah status pendaftaran.");
    }
  };

  return (
    <div>
      <Sidebar />

      <main>
        <h1>Pendaftaran</h1>

        <p>Kelola data pendaftaran kunjungan pasien.</p>

        <button onClick={() => setShowForm(!showForm)}>{showForm ? "Tutup Form" : "+ Tambah Pendaftaran"}</button>

        {showForm && (
          <form onSubmit={handleSubmit}>
            <h2>Tambah Pendaftaran</h2>

            <div>
              <label>Pasien</label>
              <br />

              <select name="patient_id" value={form.patient_id} onChange={handleChange} required>
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
              <label>Dokter</label>
              <br />

              <select name="doctor_id" value={form.doctor_id} onChange={handleChange} required>
                <option value="">-- Pilih Dokter --</option>

                {doctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.nama_dokter}
                  </option>
                ))}
              </select>
            </div>

            <br />

            <div>
              <label>Poli</label>
              <br />

              <input type="text" value={doctors.find((doctor) => doctor.id === Number(form.doctor_id))?.Poli?.nama_poli || ""} placeholder="Otomatis berdasarkan dokter" readOnly />
            </div>

            <br />

            <div>
              <label>Tanggal Kunjungan</label>
              <br />

              <input type="date" name="tanggal_kunjungan" value={form.tanggal_kunjungan} onChange={handleChange} min={new Date().toISOString().split("T")[0]} required />
            </div>

            <br />

            <div>
              <label>Jenis Pembayaran</label>
              <br />

              <select name="jenis_pembayaran" value={form.jenis_pembayaran} onChange={handleChange} required>
                <option value="Umum">Umum</option>
                <option value="BPJS">BPJS</option>
              </select>
            </div>

            <br />

            <div>
              <label>Keluhan Awal</label>
              <br />

              <textarea name="keluhan_awal" value={form.keluhan_awal} onChange={handleChange} placeholder="Masukkan keluhan awal pasien" rows="4" />
            </div>

            <br />

            <button type="submit">Simpan</button>
          </form>
        )}

        <hr />

        {loading && <p>Memuat data pendaftaran...</p>}

        {error && <p>{error}</p>}

        {!loading && !error && (
          <>
            {registrations.length === 0 ? (
              <p>Belum ada data pendaftaran.</p>
            ) : (
              <table border="1">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Pasien</th>
                    <th>Dokter</th>
                    <th>Poli</th>
                    <th>Tanggal Kunjungan</th>
                    <th>Pembayaran</th>
                    <th>Keluhan</th>
                    <th>Status</th>
                    <th>Aksi</th>
                  </tr>
                </thead>

                <tbody>
                  {registrations.map((registration, index) => (
                    <tr key={registration.id}>
                      <td>{index + 1}</td>

                      <td>{registration.Patient?.nama || "-"}</td>

                      <td>{registration.Doctor?.nama_dokter || "-"}</td>

                      <td>{registration.Poli?.nama_poli || "-"}</td>

                      <td>{registration.tanggal_kunjungan}</td>

                      <td>{registration.jenis_pembayaran}</td>

                      <td>{registration.keluhan_awal || "-"}</td>

                      <td>{registration.status}</td>

                      <td>
                        <select value={registration.status} onChange={(e) => handleStatusChange(registration.id, e.target.value)}>
                          <option value="menunggu">Menunggu</option>
                          <option value="checkin">Check In</option>
                          <option value="pemeriksaan">Pemeriksaan</option>
                          <option value="selesai">Selesai</option>
                        </select>
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

export default Registrations;
