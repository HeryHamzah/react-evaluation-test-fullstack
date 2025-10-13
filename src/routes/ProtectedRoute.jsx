// src/routes/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) {
    // jika tidak ada token, redirect ke login
    return <Navigate to="/login" replace />;
  }
  return children;
}
