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
      className="container d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <div className="card shadow p-4" style={{ width: "400px" }}>
        <h2 className="text-center mb-4">Enterprise CRM Login</h2>

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label>Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            className="btn btn-primary w-100"
            type="submit"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="text-center mt-3 text-muted">
          Demo Credentials
          <br />
          Email: <strong>test@gmail.com</strong>
          <br />
          Password: <strong>123456</strong>
        </div>
      </div>
    </div>
  );
}

export default Login;