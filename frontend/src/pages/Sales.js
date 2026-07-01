import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

function Sales() {
  const [sales, setSales] = useState([]);
  const [revenue, setRevenue] = useState(0);

  const fetchSales = async () => {
    try {
      const { data, error } = await supabase
        .from("sales")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;

      const list = (data || []).map((s) => ({
        ...s,
        _id: s.id,
        customerName: s.customerName || s.customername,
        customerEmail: s.customerEmail || s.customeremail,
      }));

      setSales(list);

      const total = list.reduce((sum, s) => sum + (Number(s.amount) || 0), 0);
      setRevenue(total);
    } catch (err) {
      console.log("Error fetching sales:", err);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  return (
    <div className="container-fluid p-0">
      <h3 className="fw-bold mb-3">Sales & Revenue Analytics</h3>

      {/* REVENUE CARD */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-5">
          <div className="card bg-success text-white p-4 shadow-sm border-0 rounded-3">
            <h6 className="small text-uppercase mb-1 opacity-75">Total Recorded Revenue</h6>
            <h1 className="fw-bold mb-0">₹ {revenue.toLocaleString()}</h1>
          </div>
        </div>
      </div>

      {/* SALES TABLE */}
      <div className="table-responsive">
        <table className="table table-bordered table-hover bg-white shadow-sm mb-0" style={{ minWidth: "500px" }}>
          <thead className="table-dark">
            <tr>
              <th>Customer Name</th>
              <th>Email</th>
              <th>Transaction Amount</th>
              <th>Deal Status</th>
            </tr>
          </thead>

          <tbody>
            {sales.length > 0 ? (
              sales.map((s) => (
                <tr key={s._id} className="align-middle">
                  <td className="fw-bold">{s.customerName || "N/A"}</td>
                  <td>{s.customerEmail || "N/A"}</td>
                  <td className="text-success fw-bold">₹{(Number(s.amount) || 0).toLocaleString()}</td>
                  <td>
                    <span className="badge bg-success">{s.status || "Closed"}</span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-4 text-muted">
                  No sales records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Sales;