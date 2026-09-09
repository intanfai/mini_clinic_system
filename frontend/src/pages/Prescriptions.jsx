import { useState } from "react";
import api from "../services/api";
import Sidebar from "../components/Sidebar";

function Prescriptions() {
  const [medicalRecordId, setMedicalRecordId] = useState("");
  const [prescriptionId, setPrescriptionId] = useState("");
  const [prescription, setPrescription] = useState(null);

  const [form, setForm] = useState({
    nama_obat: "",
    dosis: "",
    jumlah: "",
    aturan_pakai: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await api.post("/prescriptions", {
        medical_record_id: Number(medicalRecordId),
        nama_obat: form.nama_obat,
        dosis: form.dosis,
        jumlah: Number(form.jumlah),
        aturan_pakai: form.aturan_pakai,
      });

      alert("Resep berhasil disimpan.");

      setPrescription(response.data.data);
      setPrescriptionId(response.data.data.id);

      setForm({
        nama_obat: "",
        dosis: "",
        jumlah: "",
        aturan_pakai: "",
      });
    } catch (error) {
      console.error("Gagal menyimpan resep:", error);

      alert(
        error.response?.data?.message ||
          "Gagal menyimpan resep."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGetPrescription = async () => {
    if (!prescriptionId) {
      alert("Masukkan ID resep terlebih dahulu.");
      return;
    }

    try {
      const response = await api.get(
        `/prescriptions/${prescriptionId}`
      );

      setPrescription(response.data.data);
    } catch (error) {
      console.error("Gagal mengambil resep:", error);

      alert(
        error.response?.data?.message ||
          "Resep tidak ditemukan."
      );
    }
  };

  return (
    <div>
      <Sidebar />

      <main>
        <h1>Resep</h1>
        <p>Kelola resep obat pasien.</p>

        <hr />

        <h2>Tambah Resep</h2>

        <form onSubmit={handleSubmit}>
          <div>
            <label>ID Rekam Medis</label>
            <br />
            <input
              type="number"
              value={medicalRecordId}
              onChange={(e) =>
                setMedicalRecordId(e.target.value)
              }
              placeholder="Contoh: 1"
              required
            />
          </div>

          <br />

          <div>
            <label>Nama Obat</label>
            <br />
            <input
              type="text"
              name="nama_obat"
              value={form.nama_obat}
              onChange={handleChange}
              placeholder="Contoh: Paracetamol"
              required
            />
          </div>

          <br />

          <div>
            <label>Dosis</label>
            <br />
            <input
              type="text"
              name="dosis"
              value={form.dosis}
              onChange={handleChange}
              placeholder="Contoh: 500 mg"
              required
            />
          </div>

          <br />

          <div>
            <label>Jumlah</label>
            <br />
            <input
              type="number"
              name="jumlah"
              value={form.jumlah}
              onChange={handleChange}
              placeholder="Contoh: 10"
              min="1"
              required
            />
          </div>

          <br />

          <div>
            <label>Aturan Pakai</label>
            <br />
            <textarea
              name="aturan_pakai"
              value={form.aturan_pakai}
              onChange={handleChange}
              placeholder="Contoh: 3x sehari setelah makan"
              required
            />
          </div>

          <br />

          <button type="submit" disabled={loading}>
            {loading ? "Menyimpan..." : "Simpan Resep"}
          </button>
        </form>

        <hr />

        <h2>Lihat Resep</h2>

        <div>
          <label>ID Resep</label>
          <br />
          <input
            type="number"
            value={prescriptionId}
            onChange={(e) =>
              setPrescriptionId(e.target.value)
            }
            placeholder="Contoh: 1"
          />

          <button onClick={handleGetPrescription}>
            Lihat Resep
          </button>
        </div>

        <br />

        {prescription && (
          <div>
            <h3>Detail Resep</h3>

            <p>
              <strong>ID Resep:</strong>{" "}
              {prescription.id}
            </p>

            <p>
              <strong>ID Rekam Medis:</strong>{" "}
              {prescription.medical_record_id}
            </p>

            <p>
              <strong>Nama Obat:</strong>{" "}
              {prescription.nama_obat}
            </p>

            <p>
              <strong>Dosis:</strong>{" "}
              {prescription.dosis}
            </p>

            <p>
              <strong>Jumlah:</strong>{" "}
              {prescription.jumlah}
            </p>

            <p>
              <strong>Aturan Pakai:</strong>{" "}
              {prescription.aturan_pakai}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default Prescriptions;