import React, { useEffect, useState } from "react";
import axios from "axios";
import API_URL from "../config";

function Customers() {
  const [customers, setCustomers] = useState([]);

  const token = localStorage.getItem("token");

  const fetchCustomers = async () => {
    try {
      const res = await axios.get(`${API_URL}/customers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCustomers(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteCustomer = async (id) => {
    await axios.delete(`${API_URL}/customers/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    fetchCustomers();
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <div className="container mt-4">
      <h2>Customers</h2>

      <table className="table table-bordered">
        <thead className="table-dark">
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Company</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {customers.map((c) => (
            <tr key={c._id}>
              <td>{c.name}</td>
              <td>{c.email}</td>
              <td>{c.company}</td>
              <td>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => deleteCustomer(c._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Customers;