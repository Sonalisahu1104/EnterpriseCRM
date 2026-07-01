import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

function Login({ setToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Demo credentials check
      if (email === "test@gmail.com" && password === "123456") {
        const token = "demo-token-123456";
        localStorage.setItem("token", token);
        setToken(token);
        navigate("/");
        return;
      }

      // Check Supabase users table
      const { data: user, error } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .single();

      if (error || !user) {
        throw new Error("Invalid email or password");
      }

      // Simple password check
      if (user.password !== password) {
        throw new Error("Invalid email or password");
      }

      const token = `supabase-user-${user.id}`;
      localStorage.setItem("token", token);
      setToken(token);
      navigate("/");
    } catch (error) {
      alert(error.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="container-fluid d-flex justify-content-center align-items-center p-3"
      style={{ minHeight: "100vh", backgroundColor: "#f0f2f5" }}
    >
      <div
        className="card shadow-lg p-4 border-0 rounded-4"
        style={{ width: "100%", maxWidth: "420px" }}
      >
        <div className="text-center mb-4">
          <h2 className="fw-bold text-primary mb-1">Enterprise CRM</h2>
          <p className="text-muted small">Sign in to manage your leads and sales</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label fw-bold small text-secondary">Email Address</label>
            <input
              type="email"
              className="form-control form-control-lg fs-6"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label fw-bold small text-secondary">Password</label>
            <input
              type="password"
              className="form-control form-control-lg fs-6"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            className="btn btn-primary btn-lg w-100 fw-bold shadow-sm"
            type="submit"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="text-center mt-4 pt-3 border-top text-muted small">
          <span>Demo Credentials:</span>
          <div className="mt-1 bg-light p-2 rounded border">
            Email: <strong className="text-dark">test@gmail.com</strong>
            <br />
            Password: <strong className="text-dark">123456</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;