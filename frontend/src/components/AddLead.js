import React, { useEffect, useState } from "react";
import axios from "axios";
import API_URL from "../config";

function AddLead({
  selectedLead,
  setSelectedLead,
  fetchLeads,
  fetchStats,
  onClose
}) {
  const [lead, setLead] = useState({
    name: "",
    email: "",
    company: "",
    stage: "New",
  });

  const token = localStorage.getItem("token");

  // -------------------------
  // PREFILL WHEN EDITING
  // -------------------------
  useEffect(() => {
    if (selectedLead) {
      setLead(selectedLead);
    }
  }, [selectedLead]);

  // -------------------------
  // HANDLE CHANGE
  // -------------------------
  const handleChange = (e) => {
    setLead({ ...lead, [e.target.name]: e.target.value });
  };

  // -------------------------
  // SUBMIT (ADD + UPDATE)
  // -------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (selectedLead) {
        // UPDATE LEAD
        await axios.put(
          `${API_URL}/leads/${selectedLead._id}`,
          lead,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        alert("Lead Updated Successfully!");
        setSelectedLead(null);
      } else {
        // CREATE LEAD
        await axios.post(
          `${API_URL}/leads/add`,
          lead,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        alert("Lead Added Successfully!");
      }

      // Refresh dashboard
      fetchLeads();
fetchStats();

      // reset form
      setLead({
        name: "",
        email: "",
        company: "",
        stage: "New",
      });

      // close modal if used
      onClose?.();

    } catch (err) {
      console.log(err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="card p-3 mt-3">

      <h4>
        {selectedLead ? "Edit Lead" : "Add Lead"}
      </h4>

      <form onSubmit={handleSubmit}>

        <input
          className="form-control mb-2"
          name="name"
          placeholder="Name"
          value={lead.name}
          onChange={handleChange}
        />

        <input
          className="form-control mb-2"
          name="email"
          placeholder="Email"
          value={lead.email}
          onChange={handleChange}
        />

        <input
          className="form-control mb-2"
          name="company"
          placeholder="Company"
          value={lead.company}
          onChange={handleChange}
        />

        <select
          className="form-control mb-2"
          name="stage"
          value={lead.stage}
          onChange={handleChange}
        >
          <option value="New">New</option>
          <option value="Contacted">Contacted</option>
          <option value="Qualified">Qualified</option>
          <option value="Won">Won</option>
          <option value="Lost">Lost</option>
        </select>

        <button className="btn btn-primary w-100">
          {selectedLead ? "Update Lead" : "Add Lead"}
        </button>

      </form>
    </div>
  );
}

export default AddLead;