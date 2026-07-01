import React, { useState } from "react";
import axios from "axios";
import AddLead from "../components/AddLead";
import API_URL from "../config";

function LeadList({
  leads,
  fetchLeads,
  fetchStats,
  setSelectedLead,
  selectedLead
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [stageFilter, setStageFilter] = useState("All");

  const token = localStorage.getItem("token");

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
  // DELETE LEAD
  // -------------------------
  const deleteLead = async (id) => {
    if (!window.confirm("Delete this lead?")) return;

    try {
      await axios.delete(
        `${API_URL}/leads/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchLeads();
      fetchStats(); // IMPORTANT (fixes dashboard mismatch)
    } catch (err) {
      console.log(err);
      alert("Delete failed");
    }
  };

  // -------------------------
  // CONVERT TO CUSTOMER
  // -------------------------
  const convertToCustomer = async (id) => {
    try {
      await axios.post(
        `${API_URL}/customers/convert/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Lead converted to Customer");

      fetchLeads();
      fetchStats(); // IMPORTANT
    } catch (err) {
      console.log(err);
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
          <button className="btn btn-success w-100" onClick={exportToCSV}>
            📁 Export CSV
          </button>
        </div>

      </div>

      {/* TABLE */}
      <table className="table table-bordered">
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
                <td>{lead.name}</td>
                <td>{lead.email}</td>
                <td>{lead.company}</td>
                <td>{lead.stage}</td>

                <td>

                  {/* EDIT */}
                  <button
                    className="btn btn-primary btn-sm me-2"
                    onClick={() => setSelectedLead(lead)}
                  >
                    Edit
                  </button>

                  {/* DELETE */}
                  <button
                    className="btn btn-danger btn-sm me-2"
                    onClick={() => deleteLead(lead._id)}
                  >
                    Delete
                  </button>

                  {/* CONVERT */}
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => convertToCustomer(lead._id)}
                  >
                    Convert
                  </button>

                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                No leads found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* EDIT MODAL */}
      {selectedLead && (
        <AddLead
          lead={selectedLead}
          fetchLeads={fetchLeads}
          fetchStats={fetchStats}
          onClose={() => setSelectedLead(null)}
        />
      )}

    </div>
  );
}

export default LeadList;