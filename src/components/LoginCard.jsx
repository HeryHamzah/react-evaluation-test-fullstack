import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginCard.css";
import logo from "../assets/logo.svg";
import { login as loginService } from "../services/authService";

function LoginCard() {
  // state untuk show/hide password
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "", general: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = { email: "", password: "", general: "" };
    // simple email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = "Username (email) wajib diisi";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Format username (email) tidak valid";
    }
    if (!password) {
      newErrors.password = "Password wajib diisi";
    }
    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({ email: "", password: "", general: "" });
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      const { token, user } = await loginService(email, password);
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      const role = (user?.role || "").toLowerCase();
      if (role === "admin") {
        navigate("/dashboard", { replace: true });
      } else {
        navigate("/catalog", { replace: true });
      }
    } catch (err) {
      setErrors((prev) => ({ ...prev, general: err?.message || "Login gagal" }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      <div className="card p-4" style={{ width: "380px" }}>
        {/* LOGO */}
        <img src={logo} alt="Logo" className="logo mb-3" />

        {/* DESKRIPSI */}
        <p className="text-secondary-custom mb-4 inter-14">
        Enter your username and password correctly
        </p>

        {errors.general ? (
          <div className="alert alert-danger py-2" role="alert">{errors.general}</div>
        ) : null}

        <form onSubmit={handleSubmit} noValidate>
          {/* USERNAME FIELD */}
          <div className="mb-3">
            <label className="form-label inter-14-medium">Username</label>
            <input
              type="email"
              className={`form-control placeholder-inter-14-medium placeholder-color${errors.email ? " is-invalid" : ""}`}
              placeholder="Enter username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email ? (
              <div className="invalid-feedback">{errors.email}</div>
            ) : null}
          </div>

          {/* PASSWORD FIELD */}
          <div className="mb-3">
            <label className="form-label inter-14-medium">Password</label>
            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                className={`form-control placeholder-inter-14-medium placeholder-color${errors.password ? " is-invalid" : ""}`}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                className="toggle-password"
                type="button"
                aria-label="Toggle password visibility"
                onClick={() => setShowPassword(!showPassword)}
              >
                <i className={showPassword ? "bi bi-eye-slash" : "bi bi-eye"}></i>
              </button>
             
            </div>
             {/* 🟢 DIPINDAHKAN KE LUAR .password-field AGAR TIDAK NUMPUK */}
  {errors.password ? (
    <div className="invalid-feedback d-block mt-1">{errors.password}</div>
  ) : null}
          </div>

          {/* SIGN IN BUTTON */}
          <button
            className="btn btn-orange w-100 mt-3 bg-primary-custom border-0 inter-14-medium"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing In..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginCard;
