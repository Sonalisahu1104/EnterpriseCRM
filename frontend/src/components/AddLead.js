import React, { useState, useEffect } from "react";
import axios from "axios";

function AddLead({ fetchLeads, selectedLead, setSelectedLead }) {
  const [lead, setLead] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    stage: "New",
  });

  useEffect(() => {
    if (selectedLead) {
      setLead(selectedLead);
    }
  }, [selectedLead]);

  const handleChange = (e) => {
    setLead({
      ...lead,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (selectedLead) {
        await axios.put(
          `https://crmproject-1.onrender.com/api/leads/${selectedLead._id}`,
          lead
        );

        alert("Lead Updated Successfully!");
        setSelectedLead(null);
      } else {
        await axios.post("https://crmproject-1.onrender.com/api/leads", lead);

        alert("Lead Added Successfully!");
      }

      setLead({
        name: "",
        email: "",
        phone: "",
        company: "",
        stage: "New",
      });

      fetchLeads();
    } catch (error) {
      console.log(error);
      alert("Operation Failed");
    }
  };

  return (
    <div className="card shadow mt-4">
      <div className="card-header bg-primary text-white">
        <h4>{selectedLead ? "Edit Lead" : "Add New Lead"}</h4>
      </div>

      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="row">

            <div className="col-md-6 mb-3">
              <label>Name</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={lead.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label>Email</label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={lead.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label>Phone</label>
              <input
                type="text"
                className="form-control"
                name="phone"
                value={lead.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label>Company</label>
              <input
                type="text"
                className="form-control"
                name="company"
                value={lead.company}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6 mb-3">
              <label>Stage</label>
              <select
                className="form-control"
                name="stage"
                value={lead.stage}
                onChange={handleChange}
              >
                <option>New</option>
                <option>Contacted</option>
                <option>Qualified</option>
                <option>Won</option>
                <option>Lost</option>
              </select>
            </div>

          </div>

          <button className="btn btn-success">
            {selectedLead ? "Update Lead" : "Add Lead"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddLead;