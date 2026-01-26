import React, { useEffect, useState } from "react";
import { Card, Row, Col } from "react-bootstrap";
import axios from "axios";
import "./Css/Home.css";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const Home = () => {
  const [Invoices, setInvoices] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [totalProfit, setTotalProfit] = useState(0);
  const [totalSales, setTotalSales] = useState(0);

  // Fetch invoices
  useEffect(() => { 
    axios
      .get("https://billq-erp.onrender.com/invoices")
      .then((res) => setInvoices(res.data))
      .catch((err) => console.error(err));
  }, []);

  // Process sales data, total sales and profit
  useEffect(() => {
    const dataMap = {};
    let profit = 0;
    let sales = 0;

    Invoices.forEach((invoice) => {
      const date = new Date(invoice.date).toLocaleDateString("en-GB");

      if (!dataMap[date]) dataMap[date] = 0;

      if (invoice.Products && invoice.Products.length > 0) {
        invoice.Products.forEach((p) => {
          const price = p.price || 0; // selling price / MRP
          const cost = p.Cost || 0;   // cost price
          const quantity = p.quantity || 0;

          sales += price * quantity;
          profit += (price - cost) * quantity;
          dataMap[date] += price * quantity;
        });
      }
    });

    const chartData = Object.keys(dataMap).map((date) => ({
      date,
      sales: dataMap[date],
    }));

    setSalesData(chartData);
    setTotalProfit(profit);
    setTotalSales(sales);
  }, [Invoices]);

  return (
    <div
    className="home-container"
      
    >
      <h2
        style={{
          color: "#e6e6e6",
          textShadow: "0 0 6px rgba(255,255,255,0.1)",
          marginBottom: "20px",
        }}
      >
        BillQ
      </h2>

      <Row style={{ marginTop: "80px" }} className="mb-4">
        <Col md={3}>
          <Card
            className="card"
          >
            <h5>Total Invoices</h5>
            <h2>{Invoices.length}</h2>
          </Card>
        </Col>
        <Col md={3}>
          <Card
            className="card"
          >
            <h5>Total Sales</h5>
            <h2>₹{totalSales.toFixed(2)}</h2>
          </Card>
        </Col>
        <Col md={3}>
          <Card
            className="card"
          >
            <h5>Average Sale</h5>
            <h2>₹{Invoices.length > 0 ? (totalSales / Invoices.length).toFixed(2) : 0}</h2>
          </Card>
        </Col>
        <Col md={3}>
          <Card
            className="card"
          >
            <h5>Total Profit</h5>
            <h2>₹{totalProfit.toFixed(2)}</h2>
          </Card>
        </Col>
      </Row>

      <Card
        className="card"
      >
        <h5>Sales Report</h5>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={salesData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid stroke="#555" strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fill: "#fff" }} />
            <YAxis tick={{ fill: "#fff" }} />
            <Tooltip contentStyle={{ backgroundColor: "#2a2a2a", border: "none", color: "#fff" }} />
            <Bar dataKey="sales" fill="#00bfff" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};

export default Home;
