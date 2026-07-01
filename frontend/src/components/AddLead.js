import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

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
    phone: "",
    company: "",
    stage: "New",
  });

  const [loading, setLoading] = useState(false);

  // -------------------------
  // PREFILL WHEN EDITING
  // -------------------------
  useEffect(() => {
    if (selectedLead) {
      setLead({
        name: selectedLead.name || "",
        email: selectedLead.email || "",
        phone: selectedLead.phone || "",
        company: selectedLead.company || "",
        stage: selectedLead.stage || "New",
      });
    }
  }, [selectedLead]);

  // -------------------------
  // HANDLE CHANGE
  // -------------------------
  const handleChange = (e) => {
    setLead({ ...lead, [e.target.name]: e.target.value });
  };

  // -------------------------
  // SUBMIT (ADD + UPDATE via Supabase)
  // -------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (selectedLead) {
        // UPDATE LEAD IN SUPABASE
        const { error } = await supabase
          .from("leads")
          .update({
            name: lead.name,
            email: lead.email,
            phone: lead.phone || "0000000000",
            company: lead.company,
            stage: lead.stage,
            updated_at: new Date().toISOString(),
          })
          .eq("id", selectedLead._id);

        if (error) throw error;

        alert("Lead Updated Successfully!");
        if (setSelectedLead) setSelectedLead(null);
      } else {
        // CREATE LEAD IN SUPABASE
        const { error } = await supabase.from("leads").insert([
          {
            name: lead.name,
            email: lead.email,
            phone: lead.phone || "0000000000",
            company: lead.company,
            stage: lead.stage || "New",
          },
        ]);

        if (error) throw error;

        alert("Lead Added Successfully!");
      }

      // Refresh dashboard & stats
      if (fetchLeads) fetchLeads();
      if (fetchStats) fetchStats();

      // Reset form
      setLead({
        name: "",
        email: "",
        phone: "",
        company: "",
        stage: "New",
      });

      // Close modal if used
      onClose?.();
    } catch (err) {
      console.log("Error saving lead:", err);
      alert(err.message || "Something went wrong saving to Supabase");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-3 p-md-4 mt-3 shadow-sm border-0 rounded-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="fw-bold mb-0 fs-5">
          {selectedLead ? "Edit Lead Details" : "Add New Lead"}
        </h4>
        {(selectedLead || onClose) && (
          <button
            type="button"
            className="btn-close"
            onClick={() => {
              if (setSelectedLead) setSelectedLead(null);
              onClose?.();
            }}
          ></button>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-2">
          <label className="form-label small fw-bold text-secondary">Full Name *</label>
          <input
            className="form-control"
            name="name"
            placeholder="John Doe"
            value={lead.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="row g-2 mb-2">
          <div className="col-12 col-md-6">
            <label className="form-label small fw-bold text-secondary">Email Address *</label>
            <input
              type="email"
              className="form-control"
              name="email"
              placeholder="john@example.com"
              value={lead.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label small fw-bold text-secondary">Phone Number</label>
            <input
              type="text"
              className="form-control"
              name="phone"
              placeholder="9876543210"
              value={lead.phone}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="row g-2 mb-3">
          <div className="col-12 col-md-6">
            <label className="form-label small fw-bold text-secondary">Company Name</label>
            <input
              className="form-control"
              name="company"
              placeholder="TechCorp"
              value={lead.company}
              onChange={handleChange}
            />
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label small fw-bold text-secondary">Lead Stage</label>
            <select
              className="form-select"
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
          </div>
        </div>

        <button className="btn btn-primary w-100 py-2 fw-bold shadow-sm" type="submit" disabled={loading}>
          {loading ? "Saving to Supabase..." : selectedLead ? "Update Lead" : "Add Lead to Database"}
        </button>
      </form>
    </div>
  );
}

export default AddLead;