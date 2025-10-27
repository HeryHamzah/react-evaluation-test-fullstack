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

  function goAdminPanel() {
    navigate("/products");
  }

  function goUserPanel() {
    navigate("/users");
  }

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ marginBottom: 8 }}>Halo, {user ? user.name : "Pengguna"}</h1>
      <p className="text-secondary" style={{ marginBottom: 16 }}>Silakan pilih panel yang ingin dibuka:</p>

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        <div className="card" style={{ width: 280 }}>
          <div className="card-body">
            <h5 className="card-title">Admin Panel</h5>
            <p className="card-text">Masuk ke daftar produk (ProductList).</p>
            <button className="btn btn-primary" onClick={goAdminPanel}>Go to ProductList</button>
          </div>
        </div>

        <div className="card" style={{ width: 280 }}>
          <div className="card-body">
            <h5 className="card-title">User Panel</h5>
            <p className="card-text">Masuk ke daftar user (UserList).</p>
            <button className="btn btn-outline-primary" onClick={goUserPanel}>Go to UserList</button>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 24 }}>
        <button className="btn btn-secondary" onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}
