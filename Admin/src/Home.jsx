import React, { useEffect, useState } from "react";
import { Card, Row, Col } from "react-bootstrap";
import axios from "axios";
import "./Css/Home.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Home = () => {
  const [invoices, setInvoices] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [totalSales, setTotalSales] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);

  // Fetch all invoices
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/invoices`)
      .then((res) => setInvoices(res.data))
      .catch((err) => console.error("Error fetching invoices:", err));
  }, []);

  // Compute sales, profit, and chart data
  useEffect(() => {
    let sales = 0;
    let profit = 0;
    const dailySalesMap = {};

    invoices.forEach((inv) => {
      const date = new Date(inv.date).toLocaleDateString("en-GB");

      if (!dailySalesMap[date]) dailySalesMap[date] = 0;

      inv.Products?.forEach((p) => {
        const price = Number(p.price || 0);
        const cost = Number(p.Cost || 0); // make sure Cost exists in invoice
        const qty = Number(p.quantity || 0);

        const lineTotal = price * qty;
        const lineProfit = (price - cost) * qty;

        sales += lineTotal;
        profit += lineProfit;

        dailySalesMap[date] += lineTotal;
      });
    });

    setTotalSales(sales);
    setTotalProfit(profit);

    // Prepare data for chart
    const chartData = Object.keys(dailySalesMap)
      .sort((a, b) => new Date(a) - new Date(b)) // sort by date
      .map((date) => ({ date, sales: dailySalesMap[date] }));

    setSalesData(chartData);
  }, [invoices]);

  return (
    <div className="home">
      <h2 className="home-title">
        Bill<span style={{ color: "rgb(205, 162, 7)" }}>Q</span>
      </h2>

      <Row className="g-3 mb-4">
        <Col xs={12} sm={6} md={4} lg={3} className="d-flex justify-content-center">
          <Card className="summary-card" style={cardStyle}>
            <h6>Total Invoices</h6>
            <h3>{invoices.length}</h3>
          </Card>
        </Col>

        <Col xs={12} sm={6} md={4} lg={3} className="d-flex justify-content-center">
          <Card className="summary-card" style={cardStyle}>
            <h6>Total Sales</h6>
            <h3>₹{totalSales.toFixed(2)}</h3>
          </Card>
        </Col>

        <Col xs={12} sm={6} md={4} lg={3} className="d-flex justify-content-center">
          <Card className="summary-card" style={cardStyle}>
            <h6>Average Sale</h6>
            <h3>₹{invoices.length ? (totalSales / invoices.length).toFixed(2) : 0}</h3>
          </Card>
        </Col>

        <Col xs={12} sm={6} md={4} lg={3} className="d-flex justify-content-center">
          <Card className="summary-card" style={cardStyle}>
            <h6>Total Profit</h6>
            <h3>₹{totalProfit.toFixed(2)}</h3>
          </Card>
        </Col>
      </Row>

      {/* Sales Chart */}
      <Row className="mb-4">
        <Col xs={12} className="d-flex justify-content-center">
          <Card className="chart-card">
            <h6>Sales Report</h6>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData}>
                <CartesianGrid stroke="#444" strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fill: "#fff" }} />
                <YAxis tick={{ fill: "#fff" }} />
                <Tooltip
                  contentStyle={{
                    background: "#2a2a2a",
                    border: "none",
                    color: "#fff",
                  }}
                />
                <Bar dataKey="sales" fill="#00bfff" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

const cardStyle = {
  background: "#2a2a2a",
  color: "#fff",
  padding: "40px",
  borderRadius: "15px",
  boxShadow: "6px 6px 14px rgba(0, 0, 0, 0.7), -4px -4px 10px rgba(255, 255, 255, 0.05)",
};

export default Home;
