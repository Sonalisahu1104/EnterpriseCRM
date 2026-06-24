import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  return (
    <Router>
      <Routes>

        {/* LOGIN */}
        <Route
          path="/login"
          element={<Login setToken={setToken} />}
        />

        {/* PROTECTED DASHBOARD */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard token={token} />
            </ProtectedRoute>
          }
        />

      </Routes>
    </Router>
  );
}

export default App;