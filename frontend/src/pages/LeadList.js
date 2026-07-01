import React, { useState } from "react";
import { supabase } from "../supabaseClient";

function LeadList({
  leads,
  fetchLeads,
  fetchStats,
  setSelectedLead,
  selectedLead
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [stageFilter, setStageFilter] = useState("All");

  // -------------------------
  // FILTER LOGIC
  // -------------------------
  const filteredLeads = leads.filter((lead) => {
    const term = searchTerm.toLowerCase();

    const matchesSearch =
      lead.name?.toLowerCase().includes(term) ||
      lead.email?.toLowerCase().includes(term) ||
      lead.company?.toLowerCase().includes(term);

    const matchesStage =
      stageFilter === "All" || lead.stage === stageFilter;

    return matchesSearch && matchesStage;
  });

  // -------------------------
  // DELETE LEAD (Direct Supabase)
  // -------------------------
  const deleteLead = async (id) => {
    if (!window.confirm("Delete this lead?")) return;

    try {
      const { error } = await supabase.from("leads").delete().eq("id", id);
      if (error) throw error;

      fetchLeads();
      if (fetchStats) fetchStats();
    } catch (err) {
      console.log("Error deleting lead:", err);
      alert("Delete failed");
    }
  };

  // -------------------------
  // CONVERT TO CUSTOMER (Direct Supabase)
  // -------------------------
  const convertToCustomer = async (id) => {
    try {
      const { data: lead, error: leadErr } = await supabase
        .from("leads")
        .select("*")
        .eq("id", id)
        .single();
      if (leadErr || !lead) throw new Error("Lead not found");

      const newCustomer = {
        name: lead.name,
        email: lead.email,
        company: lead.company,
        sourceleadid: lead.id,
      };

      const { error: custErr } = await supabase
        .from("customers")
        .insert([newCustomer]);
      if (custErr) throw custErr;

      alert("Lead converted to Customer successfully!");

      fetchLeads();
      if (fetchStats) fetchStats();
    } catch (err) {
      console.log("Error converting lead:", err);
      alert("Conversion failed");
    }
  };

  // -------------------------
  // EXPORT CSV
  // -------------------------
  const exportToCSV = () => {
    const headers = ["Name", "Email", "Company", "Stage"];

    const rows = filteredLeads.map((lead) => [
      lead.name,
      lead.email,
      lead.company,
      lead.stage,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((e) => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "leads_report.csv");
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div>
      {/* SEARCH + FILTER + EXPORT */}
      <div className="row mb-3">
        <div className="col-md-5">
          <input
            type="text"
            className="form-control"
            placeholder="🔍 Search by name, email, company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="col-md-3">
          <select
            className="form-control"
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
          >
            <option value="All">All Stages</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
            <option value="Won">Won</option>
            <option value="Lost">Lost</option>
          </select>
        </div>

        <div className="col-md-4">
          <button className="btn btn-success w-100 shadow-sm" onClick={exportToCSV}>
            📁 Export CSV
          </button>
        </div>
      </div>

      {/* TABLE */}
      <table className="table table-bordered table-hover bg-white shadow-sm">
        <thead className="table-dark">
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Company</th>
            <th>Stage</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {filteredLeads.length > 0 ? (
            filteredLeads.map((lead) => (
              <tr key={lead._id}>
                <td className="fw-bold">{lead.name}</td>
                <td>{lead.email}</td>
                <td>{lead.company}</td>
                <td>
                  <span
                    className={`badge ${
                      lead.stage === "Won"
                        ? "bg-success"
                        : lead.stage === "Qualified"
                        ? "bg-warning text-dark"
                        : lead.stage === "Lost"
                        ? "bg-danger"
                        : "bg-info text-dark"
                    }`}
                  >
                    {lead.stage}
                  </span>
                </td>

                <td>
                  {/* EDIT */}
                  <button
                    className="btn btn-primary btn-sm me-2 shadow-sm"
                    onClick={() => setSelectedLead(lead)}
                  >
                    Edit
                  </button>

                  {/* DELETE */}
                  <button
                    className="btn btn-danger btn-sm me-2 shadow-sm"
                    onClick={() => deleteLead(lead._id)}
                  >
                    Delete
                  </button>

                  {/* CONVERT */}
                  <button
                    className="btn btn-success btn-sm shadow-sm"
                    onClick={() => convertToCustomer(lead._id)}
                  >
                    Convert
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center py-4 text-muted">
                No leads found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default LeadList;