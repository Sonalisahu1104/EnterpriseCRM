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
    <div className="container-fluid mt-2">
      <h2 className="mb-4">Sales & Revenue Analytics</h2>

      {/* REVENUE CARD */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card bg-success text-white p-4 shadow-sm border-0 rounded">
            <h5>Total Recorded Revenue</h5>
            <h1 className="fw-bold mb-0">₹ {revenue.toLocaleString()}</h1>
          </div>
        </div>
      </div>

      {/* SALES TABLE */}
      <table className="table table-bordered table-hover bg-white shadow-sm">
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
              <tr key={s._id}>
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
  );
}

export default Sales;