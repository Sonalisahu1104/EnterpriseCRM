import React, { useEffect, useState } from "react";
import axios from "axios";
import LeadList from "./LeadList";

import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function Dashboard() {
  const [stats, setStats] = useState({
    totalLeads: 0,
    newLeads: 0,
    contacted: 0,
    qualified: 0,
    won: 0,
    lost: 0,
  });

  const [leads, setLeads] = useState([]);

  const token = localStorage.getItem("token");

  // -------------------------
  // FETCH STATS (PROTECTED)
  // -------------------------
  const fetchStats = async () => {
    try {
      const res = await axios.get(
        "https://crmproject-1.onrender.com/api/leads/dashboard/stats",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setStats(res.data);
    } catch (err) {
      console.log("Stats error:", err);
    }
  };

  // -------------------------
  // FETCH LEADS (PROTECTED)
  // -------------------------
 const fetchLeads = async () => {
  try {
    const res = await axios.get(
      "https://crmproject-1.onrender.com/api/leads",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setLeads(res.data);
  } catch (err) {
    console.log("Leads error:", err);
  }
};

  useEffect(() => {
    fetchStats();
    fetchLeads();
  }, []);

  // -------------------------
  // LOGOUT
  // -------------------------
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  // -------------------------
  // CHART DATA
  // -------------------------
  const pieData = [
    { name: "New", value: stats.newLeads },
    { name: "Contacted", value: stats.contacted },
    { name: "Qualified", value: stats.qualified },
    { name: "Won", value: stats.won },
    { name: "Lost", value: stats.lost },
  ];

  const barData = [
    { stage: "New", value: stats.newLeads },
    { stage: "Contacted", value: stats.contacted },
    { stage: "Qualified", value: stats.qualified },
    { stage: "Won", value: stats.won },
    { stage: "Lost", value: stats.lost },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#FF4D4F"];

  return (
    <div className="container-fluid">
      <div className="row">

        {/* SIDEBAR */}
        <div className="col-md-2 bg-dark text-white vh-100 p-3">
          <h4>Enterprise CRM</h4>
          <hr />

          <p>🏠 Dashboard</p>
          <p>👤 Leads</p>
          <p>👥 Customers</p>
          <p>💰 Sales</p>
          <p>📊 Reports</p>

          <hr />

          <button className="btn btn-danger btn-sm" onClick={handleLogout}>
            Logout
          </button>
        </div>

        {/* MAIN CONTENT */}
        <div className="col-md-10 p-4">

          <h2>Dashboard</h2>

          {/* STATS CARDS */}
          <div className="row mt-4">

            <div className="col-md-3">
              <div className="card bg-primary text-white p-3">
                <h5>Total Leads</h5>
                <h2>{stats.totalLeads}</h2>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card bg-success text-white p-3">
                <h5>New Leads</h5>
                <h2>{stats.newLeads}</h2>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card bg-warning text-dark p-3">
                <h5>Qualified</h5>
                <h2>{stats.qualified}</h2>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card bg-danger text-white p-3">
                <h5>Won</h5>
                <h2>{stats.won}</h2>
              </div>
            </div>

          </div>

          {/* CHARTS */}
          <div className="row mt-5">

            {/* PIE CHART */}
            <div className="col-md-6">
              <h5>Lead Distribution</h5>

              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* BAR CHART */}
            <div className="col-md-6">
              <h5>Stage-wise Leads</h5>

              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData}>
                  <XAxis dataKey="stage" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>

          </div>

          {/* LEADS TABLE */}
          <div className="mt-5">
            <LeadList leads={leads} />
          </div>

        </div>
      </div>
    </div>
  );
}

export default Dashboard;