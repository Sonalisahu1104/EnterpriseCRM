import React, { useEffect, useState } from "react";
import axios from "axios";
import LeadList from "./LeadList";
import AddLead from "../components/AddLead";

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
  const token = localStorage.getItem("token");

  const [stats, setStats] = useState({
    totalLeads: 0,
    newLeads: 0,
    contacted: 0,
    qualified: 0,
    won: 0,
    lost: 0,
  });

  const [leads, setLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [showAddLead, setShowAddLead] = useState(false);
  const [refresh, setRefresh] = useState(false);

  // ------------------------
  // Fetch Dashboard Stats
  // ------------------------
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
      console.log(err);
    }
  };

  // ------------------------
  // Fetch Leads
  // ------------------------
  const fetchLeads = async () => {
  try {
    const res = await axios.get(
      "https://crmproject-1.onrender.com/api/leads"
    );
    setLeads(res.data);
  } catch (err) {
    console.log(err);
  }
};

useEffect(() => {
  fetchLeads();
}, [refresh]);

  // ------------------------
  // Logout
  // ------------------------
  const handleLogout = () => {
  try {
    localStorage.removeItem("token");
    sessionStorage.clear();

    // Redirect to login
    window.location.replace("/login");
  } catch (err) {
    console.error(err);

    // Even if an error occurs, redirect to login
    window.location.replace("/login");
  }
};

  // ------------------------
  // Chart Data
  // ------------------------
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

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#FF4D4F",
  ];

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

        <button
          className="btn btn-danger w-100"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      {/* MAIN CONTENT */}
      <div className="col-md-10 p-4">

        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Enterprise CRM Dashboard</h2>

          <button
            className="btn btn-primary"
            onClick={() => setShowAddLead(true)}
          >
            + Add Lead
          </button>
        </div>

        {/* STATS */}
        <div className="row mb-4">

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
        <div className="row mb-4">

          <div className="col-md-6">
            <div className="card shadow p-3">
              <h5 className="text-center">Lead Distribution</h5>

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
                      <Cell
                        key={index}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card shadow p-3">
              <h5 className="text-center">Stage Wise Leads</h5>

              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData}>
                  <XAxis dataKey="stage" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#0d6efd" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* LEAD TABLE */}
        <div className="card shadow">
          <div className="card-header bg-dark text-white">
            <h4>Lead Management</h4>
          </div>

          <div className="card-body">
            <LeadList
              leads={leads}
              selectedLead={selectedLead}
              setSelectedLead={setSelectedLead}
              fetchLeads={fetchLeads}
              fetchStats={fetchStats}
            />
          </div>
        </div>

        {/* ADD LEAD */}
        {showAddLead && (
          <AddLead
            fetchLeads={() => {
              fetchLeads();
              fetchStats();
            }}
            selectedLead={null}
            setSelectedLead={() => {
              setShowAddLead(false);
            }}
          />
        )}
        {/* EDIT LEAD */}
        {selectedLead && (
          <AddLead
            fetchLeads={fetchLeads}
            selectedLead={selectedLead}
            setSelectedLead={setSelectedLead}
          />
        )}

      </div>
    </div>
  </div>
);
}

export default Dashboard;