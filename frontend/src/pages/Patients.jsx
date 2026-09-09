import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import api from "../services/api";
import Sidebar from "../components/Sidebar";

function Patients() {
  const [patients, setPatients] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    nik: "",
    nama: "",
    jenis_kelamin: "",
    tanggal_lahir: "",
    no_telp: "",
    alamat: "",
  });

  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  const [editMode, setEditMode] = useState(false);
  const [editPatientId, setEditPatientId] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Ambil role user dari JWT
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded = jwtDecode(token);

        console.log("User dari token:", decoded);

        setUserRole(decoded.role);
      } catch (error) {
        console.error("Token tidak valid:", error);
      }
    }
  }, []);

  const getPatients = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/patients", {
        params: {
          search,
          page,
          limit: 10,
        },
      });

      console.log("Data pasien:", response.data);

      setPatients(response.data.data.patients);
      setPagination(response.data.data.pagination);
    } catch (error) {
      console.error("Gagal mengambil data pasien:", error);

      setError(error.response?.data?.message || "Gagal mengambil data pasien.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPatients();
  }, [page]);

  const handleSearch = (e) => {
    e.preventDefault();

    setPage(1);
    getPatients();
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const resetForm = () => {
    setFormData({
      nik: "",
      nama: "",
      jenis_kelamin: "",
      tanggal_lahir: "",
      no_telp: "",
      alamat: "",
    });

    setFormError("");
    setEditMode(false);
    setEditPatientId(null);
  };

  const handleAddPatient = () => {
    resetForm();
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setFormError("");
    setFormLoading(true);

    try {
      if (editMode) {
        await api.put(`/patients/${editPatientId}`, {
          nama: formData.nama,
          jenis_kelamin: formData.jenis_kelamin,
          tanggal_lahir: formData.tanggal_lahir,
          no_telp: formData.no_telp,
          alamat: formData.alamat,
        });

        console.log("Pasien berhasil diperbarui");
      } else {
        await api.post("/patients", formData);

        console.log("Pasien berhasil ditambahkan");
      }

      resetForm();
      setShowForm(false);

      getPatients();
    } catch (error) {
      console.error("Gagal menyimpan pasien:", error);

      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const firstError = Object.values(errors)[0];

        setFormError(Array.isArray(firstError) ? firstError[0] : firstError);
      } else {
        setFormError(error.response?.data?.message || "Terjadi kesalahan.");
      }
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (patient) => {
    setEditMode(true);
    setEditPatientId(patient.id);

    setFormData({
      nik: patient.nik || "",
      nama: patient.nama || "",
      jenis_kelamin: patient.jenis_kelamin || "",
      tanggal_lahir: patient.tanggal_lahir || "",
      no_telp: patient.no_telp || "",
      alamat: patient.alamat || "",
    });

    setFormError("");
    setShowForm(true);
  };

  const handleCloseForm = () => {
    resetForm();
    setShowForm(false);
  };

  // Hapus pasien
  const handleDelete = async (patient) => {
    const confirmDelete = window.confirm(`Apakah kamu yakin ingin menghapus pasien "${patient.nama}"?`);

    if (!confirmDelete) {
      return;
    }

    try {
      await api.delete(`/patients/${patient.id}`);

      console.log("Pasien berhasil dihapus");

      // Ambil data terbaru
      getPatients();
    } catch (error) {
      console.error("Gagal menghapus pasien:", error);

      alert(error.response?.data?.message || "Gagal menghapus pasien.");
    }
  };

  const handleDetail = async (patientId) => {
    try {
      setDetailLoading(true);

      const response = await api.get(`/patients/${patientId}`);

      console.log("Detail pasien:", response.data);

      setSelectedPatient(response.data.data);
      setShowDetail(true);
    } catch (error) {
      console.error("Gagal mengambil detail pasien:", error);

      alert(error.response?.data?.message || "Gagal mengambil detail pasien.");
    } finally {
      setDetailLoading(false);
    }
  };

  return (
    <div>
      <Sidebar />

      <main>
        <h1>Data Pasien</h1>

        <p>Kelola data pasien klinik.</p>

        {/* TOMBOL TAMBAH */}
        <button onClick={handleAddPatient}>+ Tambah Pasien</button>

        <br />
        <br />

        {/* FORM */}
        {showForm && (
          <div>
            <h2>{editMode ? "Edit Pasien" : "Tambah Pasien"}</h2>

            {formError && <p>{formError}</p>}

            <form onSubmit={handleSubmit}>
              <div>
                <label>NIK</label>

                <input type="text" name="nik" value={formData.nik} onChange={handleFormChange} placeholder="Masukkan NIK" disabled={editMode} required />
              </div>

              <div>
                <label>Nama</label>

                <input type="text" name="nama" value={formData.nama} onChange={handleFormChange} placeholder="Masukkan nama pasien" required />
              </div>

              <div>
                <label>Jenis Kelamin</label>

                <select name="jenis_kelamin" value={formData.jenis_kelamin} onChange={handleFormChange} required>
                  <option value="">Pilih jenis kelamin</option>

                  <option value="L">Laki-laki</option>

                  <option value="P">Perempuan</option>
                </select>
              </div>

              <div>
                <label>Tanggal Lahir</label>

                <input type="date" name="tanggal_lahir" value={formData.tanggal_lahir} onChange={handleFormChange} required />
              </div>

              <div>
                <label>No. Telepon</label>

                <input type="text" name="no_telp" value={formData.no_telp} onChange={handleFormChange} placeholder="Masukkan nomor telepon" />
              </div>

              <div>
                <label>Alamat</label>

                <textarea name="alamat" value={formData.alamat} onChange={handleFormChange} placeholder="Masukkan alamat" rows="3" />
              </div>

              <br />

              <button type="submit" disabled={formLoading}>
                {formLoading ? "Menyimpan..." : editMode ? "Simpan Perubahan" : "Simpan Pasien"}
              </button>

              <button type="button" onClick={handleCloseForm}>
                Batal
              </button>
            </form>
          </div>
        )}

        {/* DETAIL PASIEN */}
        {showDetail && selectedPatient && (
          <div>
            <h2>Detail Pasien</h2>

            {detailLoading ? (
              <p>Memuat detail pasien...</p>
            ) : (
              <>
                <p>
                  <strong>No. RM:</strong> {selectedPatient.no_rm}
                </p>

                <p>
                  <strong>NIK:</strong> {selectedPatient.nik}
                </p>

                <p>
                  <strong>Nama:</strong> {selectedPatient.nama}
                </p>

                <p>
                  <strong>Jenis Kelamin:</strong> {selectedPatient.jenis_kelamin === "L" ? "Laki-laki" : "Perempuan"}
                </p>

                <p>
                  <strong>Tanggal Lahir:</strong> {selectedPatient.tanggal_lahir}
                </p>

                <p>
                  <strong>No. Telepon:</strong> {selectedPatient.no_telp || "-"}
                </p>

                <p>
                  <strong>Alamat:</strong> {selectedPatient.alamat || "-"}
                </p>

                <button
                  onClick={() => {
                    setShowDetail(false);
                    setSelectedPatient(null);
                  }}
                >
                  Tutup
                </button>
              </>
            )}
          </div>
        )}

        <br />

        {/* SEARCH */}
        <form onSubmit={handleSearch}>
          <input type="text" placeholder="Cari nama atau NIK..." value={search} onChange={(e) => setSearch(e.target.value)} />

          <button type="submit">Cari</button>
        </form>

        <br />

        {/* TABLE */}
        {loading && <p>Memuat data pasien...</p>}

        {error && <p>{error}</p>}

        {!loading && !error && (
          <>
            <table border="1">
              <thead>
                <tr>
                  <th>No</th>
                  <th>No. RM</th>
                  <th>NIK</th>
                  <th>Nama</th>
                  <th>Jenis Kelamin</th>
                  <th>Tanggal Lahir</th>
                  <th>No. Telepon</th>
                  <th>Aksi</th>
                </tr>
              </thead>

              <tbody>
                {patients.length > 0 ? (
                  patients.map((patient, index) => (
                    <tr key={patient.id}>
                      <td>{(page - 1) * 10 + index + 1}</td>

                      <td>{patient.no_rm}</td>

                      <td>{patient.nik}</td>

                      <td>{patient.nama}</td>

                      <td>{patient.jenis_kelamin === "L" ? "Laki-laki" : "Perempuan"}</td>

                      <td>{patient.tanggal_lahir}</td>

                      <td>{patient.no_telp || "-"}</td>

                      <td>
                        <button onClick={() => handleDetail(patient.id)}>Detail</button>

                        <button onClick={() => handleEdit(patient)}>Edit</button>

                        {userRole === "administrator" && <button onClick={() => handleDelete(patient)}>Hapus</button>}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8">Tidak ada data pasien.</td>
                  </tr>
                )}
              </tbody>
            </table>

            <br />

            {/* PAGINATION */}
            {pagination && (
              <div>
                <button onClick={() => setPage(page - 1)} disabled={page === 1}>
                  Sebelumnya
                </button>

                <span>
                  {" "}
                  Halaman {pagination.page} dari {pagination.totalPages}{" "}
                </span>

                <button onClick={() => setPage(page + 1)} disabled={page >= pagination.totalPages}>
                  Berikutnya
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default Patients;
