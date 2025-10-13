// src/pages/Dashboard.jsx
import React from "react";
import { logout } from "../services/authService";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const rawUser = localStorage.getItem("user");
  const user = rawUser ? JSON.parse(rawUser) : null;

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Halo, {user ? user.name : "Pengguna"}</h1>
      <p>Ini halaman dashboard (contoh setelah login).</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
