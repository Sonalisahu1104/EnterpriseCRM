import React, { useEffect, useState } from "react";
import axios from "axios";

function Sales() {
  const [sales, setSales] = useState([]);
  const [revenue, setRevenue] = useState(0);

  const token = localStorage.getItem("token");

  const fetchSales = async () => {
    const res = await axios.get("https://crmproject-1.onrender.com/api/sales", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setSales(res.data);
  };

  const fetchRevenue = async () => {
    const res = await axios.get(
      "https://crmproject-1.onrender.com/api/sales/revenue",
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setRevenue(res.data.totalRevenue);
  };

  useEffect(() => {
    fetchSales();
    fetchRevenue();
  }, []);

  return (
    <div className="container mt-4">

      <h2>Sales Dashboard</h2>

      {/* REVENUE CARD */}
      <div className="card bg-success text-white p-3 mb-3">
        <h4>Total Revenue</h4>
        <h2>₹ {revenue}</h2>
      </div>

      {/* SALES TABLE */}
      <table className="table table-bordered">
        <thead className="table-dark">
          <tr>
            <th>Customer</th>
            <th>Email</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {sales.map((s) => (
            <tr key={s._id}>
              <td>{s.customerName}</td>
              <td>{s.customerEmail}</td>
              <td>₹{s.amount}</td>
              <td>{s.status}</td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}

export default Sales;