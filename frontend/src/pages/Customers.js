import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

function Customers() {
  const [customers, setCustomers] = useState([]);

  const fetchCustomers = async () => {
    try {
      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;

      setCustomers((data || []).map((c) => ({ ...c, _id: c.id })));
    } catch (err) {
      console.log("Error fetching customers:", err);
    }
  };

  const deleteCustomer = async (id) => {
    if (!window.confirm("Delete this customer?")) return;
    try {
      const { error } = await supabase.from("customers").delete().eq("id", id);
      if (error) throw error;
      fetchCustomers();
    } catch (err) {
      console.log("Error deleting customer:", err);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <div className="container-fluid p-0">
      <h3 className="fw-bold mb-3">Converted Customers Database</h3>

      <div className="table-responsive">
        <table className="table table-bordered table-hover bg-white shadow-sm mb-0" style={{ minWidth: "500px" }}>
          <thead className="table-dark">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Company</th>
              <th style={{ width: "100px" }}>Action</th>
            </tr>
          </thead>

          <tbody>
            {customers.length > 0 ? (
              customers.map((c) => (
                <tr key={c._id} className="align-middle">
                  <td className="fw-bold">{c.name}</td>
                  <td>{c.email}</td>
                  <td>{c.company}</td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm shadow-sm px-3"
                      onClick={() => deleteCustomer(c._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-4 text-muted">
                  No converted customers found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Customers;