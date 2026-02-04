import React, { useState, useEffect } from "react";
import { Card, Table } from "react-bootstrap";
import axios from "axios";
import "./Css/Stocks.css";
import { useAuth } from "./AuthProvider";

const Stocks = () => {
  const [Stocks, setStocks] = useState([]);

  console.log(Stocks);
  const { user } = useAuth(); 
  

  const fetchStocks = async () => {
    try {
      // Fetch all Stocks from Stocks collection
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/stocks`,{
    headers: {
      Authorization: `Bearer ${user.token}`, // ✅ pass token from context
    },
  });
      setStocks(response.data);
    } catch (error) {
      console.error("Error fetching Stocks:", error);
    }
  };

  useEffect(() => {
    fetchStocks();
  }, []);

  return (
    <div className="stocks">
      <Card
        style={{
          width: "100%",
          background: "#2a2a2a",
          borderRadius: "20px",
          padding: "20px",
          boxShadow: "8px 8px 16px rgba(0,0,0,0.7), -8px -8px 16px rgba(255,255,255,0.05)",
          color: "#fff",
        }}
      >
        <h2 style={{ color: "#e6e6e6" }}>Stocks</h2>

        <div style={{ overflowX: "auto", marginTop: "20px" }}>
          <Table striped bordered hover variant="dark">
            <thead>
              <tr>
                <th>Barcode</th>
                <th>Product Name</th>
                <th>Brand</th>
                <th>Unit</th>
                <th>Quantity</th>
                <th>Cost</th>
                <th>MRP</th>
              </tr>
            </thead>
            <tbody>
              {Stocks.length > 0 ? (
                Stocks.map((p, index) => (
                  <tr key={index}>
                    <td>{p.Barcode}</td>
                    <td>{p.name}</td>
                    <td>{p.Brand}</td>
                    <td>{p.Unit}</td>
                    <td>{p.quantity}</td>
                    <td>{p.cost?.toFixed(2)}</td>
                    <td>{p.MRP?.toFixed(2)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} style={{ textAlign: "center" }}>
                    No Stocks found
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </Card>
    </div>
  );
};

export default Stocks;
