import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";
import "bootstrap/dist/css/bootstrap.min.css";

export default function LoginPage() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Username dan password wajib diisi");
      return;
    }

    try {
      setLoading(true);
      // Simulasi login
      const res = await login("user@example.com", password);
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));
      navigate("/dashboard");
    } catch (err) {
      setError("Username atau password salah");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{ backgroundColor: "#FFFFFF" }}
    >
      <div
        className="card p-4 shadow-sm"
        style={{
          width: "360px",
          border: "1px solid #E6E9F0",
          borderRadius: "12px",
        }}
      >
        <h4 className="text-center mb-2">Card di Tengah</h4>
        <p className="text-center text-muted small mb-0">
          Latar belakang full putih
        </p>
      </div>
    </div>
  );
}
