import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import LeadList from "./LeadList";
import AddLead from "../components/AddLead";
import Customers from "./Customers";
import Sales from "./Sales";

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
  const [activeTab, setActiveTab] = useState("Dashboard");

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

  // ------------------------
  // Fetch Dashboard Stats directly from Supabase
  // ------------------------
  const fetchStats = async () => {
    try {
      const { data: leadsData, error } = await supabase.from("leads").select("stage");
      if (error) throw error;

      const normalize = (s) => (s || "").toLowerCase();
      const list = leadsData || [];

      setStats({
        totalLeads: list.length,
        newLeads: list.filter((l) => normalize(l.stage) === "new").length,
        contacted: list.filter((l) => normalize(l.stage) === "contacted").length,
        qualified: list.filter((l) => normalize(l.stage) === "qualified").length,
        won: list.filter((l) => normalize(l.stage) === "won").length,
        lost: list.filter((l) => normalize(l.stage) === "lost").length,
      });
    } catch (err) {
      console.log("Error fetching stats:", err);
    }
  };

  // ------------------------
  // Fetch Leads directly from Supabase
  // ------------------------
  const fetchLeads = async () => {
    try {
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;

      const formatted = (data || []).map((item) => ({ ...item, _id: item.id }));
      setLeads(formatted);
    } catch (err) {
      console.log("Error fetching leads:", err);
    }
  };

  useEffect(() => {
    fetchLeads();
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  // ------------------------
  // Logout
  // ------------------------
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  // Chart Colors & Data
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#FF4D4F"];
  const pieData = [
    { name: "New", value: stats.newLeads || 0 },
    { name: "Contacted", value: stats.contacted || 0 },
    { name: "Qualified", value: stats.qualified || 0 },
    { name: "Won", value: stats.won || 0 },
    { name: "Lost", value: stats.lost || 0 },
  ];

  const barData = [
    { stage: "New", value: Number(stats.newLeads) || 0 },
    { stage: "Contacted", value: Number(stats.contacted) || 0 },
    { stage: "Qualified", value: Number(stats.qualified) || 0 },
    { stage: "Won", value: Number(stats.won) || 0 },
    { stage: "Lost", value: Number(stats.lost) || 0 },
  ];

  const sidebarTabs = [
    { key: "Dashboard", label: "🏠 Dashboard" },
    { key: "Leads", label: "👤 Leads" },
    { key: "Customers", label: "👥 Customers" },
    { key: "Sales", label: "💰 Sales" },
    { key: "Reports", label: "📊 Reports" },
  ];

  return (
    <div className="container-fluid p-0">
      {/* MOBILE TOP NAVBAR & TABS */}
      <div className="d-md-none bg-dark text-white p-3 shadow-lg sticky-top">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-bold mb-0 text-light">🚀 Enterprise CRM</h5>
          <button className="btn btn-sm btn-outline-danger px-3 rounded-pill" onClick={handleLogout}>
            Logout
          </button>
        </div>

        {/* HORIZONTAL SCROLLABLE PILL TABS FOR MOBILE */}
        <div
          className="d-flex gap-2 pb-1"
          style={{ overflowX: "auto", whiteSpace: "nowrap", WebkitOverflowScrolling: "touch" }}
        >
          {sidebarTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`btn btn-sm px-3 rounded-pill fw-bold ${
                activeTab === tab.key ? "btn-primary shadow-sm" : "btn-dark text-light border border-secondary"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="row g-0">
        {/* DESKTOP SIDEBAR */}
        <div
          className="d-none d-md-flex col-md-2 bg-dark text-white vh-100 p-3 flex-column justify-content-between shadow-lg sticky-top"
          style={{ minWidth: "220px", zIndex: 1020 }}
        >
          <div>
            <h4 className="fw-bold mb-3 text-center text-light">Enterprise CRM</h4>
            <hr className="border-secondary" />

            <div className="mt-3">
              {sidebarTabs.map((tab) => (
                <div
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`p-3 mb-2 rounded d-flex align-items-center ${
                    activeTab === tab.key
                      ? "bg-primary text-white fw-bold shadow-sm"
                      : "text-light hover-bg-secondary"
                  }`}
                  style={{
                    cursor: "pointer",
                    transition: "all 0.2s ease-in-out",
                    opacity: activeTab === tab.key ? 1 : 0.85,
                    userSelect: "none",
                  }}
                  onMouseEnter={(e) => {
                    if (activeTab !== tab.key) e.currentTarget.style.opacity = 1;
                  }}
                  onMouseLeave={(e) => {
                    if (activeTab !== tab.key) e.currentTarget.style.opacity = 0.85;
                  }}
                >
                  <span style={{ fontSize: "1.1rem" }}>{tab.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <hr className="border-secondary" />
            <button className="btn btn-danger w-100 py-2 shadow-sm fw-bold" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>

        {/* MAIN CONTENT AREA */}
        <div
          className="col-12 col-md-10 p-3 p-md-4"
          style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}
        >
          {/* TAB 1: DASHBOARD */}
          {activeTab === "Dashboard" && (
            <div>
              <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-2 mb-4">
                <h2 className="fw-bold mb-0 fs-3">Executive Dashboard</h2>
                <button
                  className="btn btn-primary shadow-sm w-100 w-sm-auto fw-bold px-4 py-2"
                  onClick={() => setShowAddLead(true)}
                >
                  + Add Lead
                </button>
              </div>

              {/* STATS CARDS */}
              <div className="row g-3 mb-4">
                <div className="col-6 col-md-3">
                  <div className="card bg-primary text-white p-3 shadow-sm border-0 h-100 rounded-3">
                    <h6 className="small text-uppercase mb-1 opacity-75">Total Leads</h6>
                    <h2 className="fw-bold mb-0">{stats.totalLeads}</h2>
                  </div>
                </div>
                <div className="col-6 col-md-3">
                  <div className="card bg-success text-white p-3 shadow-sm border-0 h-100 rounded-3">
                    <h6 className="small text-uppercase mb-1 opacity-75">New Leads</h6>
                    <h2 className="fw-bold mb-0">{stats.newLeads}</h2>
                  </div>
                </div>
                <div className="col-6 col-md-3">
                  <div className="card bg-warning text-dark p-3 shadow-sm border-0 h-100 rounded-3">
                    <h6 className="small text-uppercase mb-1 opacity-75">Qualified</h6>
                    <h2 className="fw-bold mb-0">{stats.qualified}</h2>
                  </div>
                </div>
                <div className="col-6 col-md-3">
                  <div className="card bg-danger text-white p-3 shadow-sm border-0 h-100 rounded-3">
                    <h6 className="small text-uppercase mb-1 opacity-75">Won Deals</h6>
                    <h2 className="fw-bold mb-0">{stats.won}</h2>
                  </div>
                </div>
              </div>

              {/* CHARTS */}
              <div className="row g-3 mb-4">
                <div className="col-12 col-md-6">
                  <div className="card shadow-sm p-3 border-0 rounded-3 h-100">
                    <h5 className="text-center fw-bold mb-3">Lead Distribution</h5>
                    <ResponsiveContainer width="100%" height={280}>
                      <PieChart>
                        <Pie
                          data={pieData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={90}
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
                </div>

                <div className="col-12 col-md-6">
                  <div className="card shadow-sm p-3 border-0 rounded-3 h-100">
                    <h5 className="text-center fw-bold mb-3">Stage Wise Leads</h5>
                    <ResponsiveContainer width="100%" height={280}>
                      <BarChart data={barData}>
                        <XAxis dataKey="stage" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" fill="#0d6efd" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* RECENT LEADS TABLE IN DASHBOARD */}
              <div className="card shadow-sm border-0 rounded-3">
                <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center py-3 flex-wrap gap-2">
                  <h5 className="mb-0 fw-bold">Recent Lead Management</h5>
                  <button className="btn btn-sm btn-outline-light rounded-pill px-3" onClick={() => setActiveTab("Leads")}>
                    View All Leads →
                  </button>
                </div>
                <div className="card-body p-2 p-md-3">
                  <LeadList
                    leads={leads}
                    selectedLead={selectedLead}
                    setSelectedLead={setSelectedLead}
                    fetchLeads={fetchLeads}
                    fetchStats={fetchStats}
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: LEADS */}
          {activeTab === "Leads" && (
            <div>
              <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-2 mb-4">
                <h2 className="fw-bold mb-0 fs-3">Leads Management</h2>
                <button
                  className="btn btn-primary shadow-sm w-100 w-sm-auto fw-bold px-4 py-2"
                  onClick={() => setShowAddLead(true)}
                >
                  + Add Lead
                </button>
              </div>

              <div className="card shadow-sm border-0 rounded-3">
                <div className="card-header bg-primary text-white py-3">
                  <h5 className="mb-0 fw-bold">All Tracked Leads</h5>
                </div>
                <div className="card-body p-2 p-md-3">
                  <LeadList
                    leads={leads}
                    selectedLead={selectedLead}
                    setSelectedLead={setSelectedLead}
                    fetchLeads={fetchLeads}
                    fetchStats={fetchStats}
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CUSTOMERS */}
          {activeTab === "Customers" && (
            <div className="card shadow-sm border-0 rounded-3 p-2 p-md-3">
              <Customers />
            </div>
          )}

          {/* TAB 4: SALES */}
          {activeTab === "Sales" && (
            <div className="card shadow-sm border-0 rounded-3 p-2 p-md-3">
              <Sales />
            </div>
          )}

          {/* TAB 5: REPORTS */}
          {activeTab === "Reports" && (
            <div>
              <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-2 mb-4">
                <h2 className="fw-bold mb-0 fs-3">Analytics & Executive Reports</h2>
                <button
                  className="btn btn-success btn-lg shadow-sm w-100 w-sm-auto fw-bold"
                  onClick={() => {
                    const headers = ["Name", "Email", "Company", "Stage"];
                    const rows = leads.map((l) => [l.name, l.email, l.company, l.stage]);
                    const csvContent =
                      "data:text/csv;charset=utf-8," +
                      [headers, ...rows].map((e) => e.join(",")).join("\n");
                    const encodedUri = encodeURI(csvContent);
                    const link = document.createElement("a");
                    link.setAttribute("href", encodedUri);
                    link.setAttribute("download", "crm_full_executive_report.csv");
                    document.body.appendChild(link);
                    link.click();
                  }}
                >
                  📁 Download CSV Report
                </button>
              </div>

              <div className="row g-3 mb-4">
                <div className="col-12 col-md-4">
                  <div className="card bg-info text-white p-3 shadow-sm border-0 rounded-3 h-100">
                    <h6 className="small text-uppercase mb-1 opacity-75">Total Tracked Leads</h6>
                    <h2 className="fw-bold mb-0">{stats.totalLeads}</h2>
                  </div>
                </div>
                <div className="col-12 col-md-4">
                  <div className="card bg-success text-white p-3 shadow-sm border-0 rounded-3 h-100">
                    <h6 className="small text-uppercase mb-1 opacity-75">Closed / Won Deals</h6>
                    <h2 className="fw-bold mb-0">{stats.won}</h2>
                  </div>
                </div>
                <div className="col-12 col-md-4">
                  <div className="card bg-warning text-dark p-3 shadow-sm border-0 rounded-3 h-100">
                    <h6 className="small text-uppercase mb-1 opacity-75">Lost Opportunities</h6>
                    <h2 className="fw-bold mb-0">{stats.lost}</h2>
                  </div>
                </div>
              </div>

              <div className="card shadow-sm p-3 p-md-4 border-0 rounded-3">
                <h4 className="fw-bold mb-3">Stage Conversion & Breakdown</h4>
                <div className="table-responsive">
                  <table className="table table-striped table-hover mt-2 mb-0">
                    <thead className="table-dark">
                      <tr>
                        <th>Lead Stage</th>
                        <th>Total Count</th>
                        <th>Percentage</th>
                        <th style={{ minWidth: "150px" }}>Visual Indicator</th>
                      </tr>
                    </thead>
                    <tbody>
                      {barData.map((b, i) => {
                        const pct =
                          stats.totalLeads > 0
                            ? ((b.value / stats.totalLeads) * 100).toFixed(1)
                            : 0;
                        return (
                          <tr key={i}>
                            <td className="fw-bold">{b.stage}</td>
                            <td>{b.value}</td>
                            <td>{pct}%</td>
                            <td style={{ verticalAlign: "middle" }}>
                              <div className="progress shadow-sm" style={{ height: "12px" }}>
                                <div
                                  className="progress-bar"
                                  role="progressbar"
                                  style={{
                                    width: `${pct}%`,
                                    backgroundColor: COLORS[i % COLORS.length],
                                  }}
                                ></div>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ADD LEAD MODAL */}
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

          {/* EDIT LEAD MODAL */}
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