import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await api.post("/login", {
        email,
        password,
      });

      console.log("Login berhasil:", response.data);

      const token = response.data.data.token;

      localStorage.setItem("token", token);

      console.log("Token tersimpan");

      navigate("/dashboard");
    } catch (error) {
      console.error("Login gagal:", error);

      setError(
        error.response?.data?.message ||
          "Login gagal. Silakan coba lagi."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <aside className="login-visual" aria-hidden="true">
        <div className="login-visual-content">
          <span className="login-mark">Mini Clinic</span>
          <p className="login-visual-caption">
            Sistem manajemen rekam medis dan layanan pasien.
          </p>
        </div>

        <svg
          className="login-pulse"
          viewBox="0 0 600 120"
          preserveAspectRatio="none"
        >
          <polyline
            points="0,60 120,60 145,60 160,20 180,100 200,60 230,60 600,60"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </aside>

      <main className="login-form-panel">
        <form className="login-form" onSubmit={handleLogin} noValidate>
          <h1>Masuk</h1>
          <p className="login-subtitle">
            Gunakan akun staf klinik untuk melanjutkan.
          </p>

          <div className="login-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@klinik.com"
              autoComplete="username"
            />
          </div>

          <div className="login-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password"
              autoComplete="current-password"
            />
          </div>

          {error && (
            <p className="login-error" role="alert">
              {error}
            </p>
          )}

          <button type="submit" disabled={loading}>
            {loading ? "Memproses..." : "Masuk"}
          </button>
        </form>
      </main>
    </div>
  );
}

export default Login;