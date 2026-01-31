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

  useEffect(() => {
    axios
      .get("https://billq-erp.onrender.com/invoices")
      .then((res) => setInvoices(res.data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    let sales = 0;
    let profit = 0;
    const map = {};

    invoices.forEach((inv) => {
      const date = new Date(inv.date).toLocaleDateString("en-GB");
      map[date] = map[date] || 0;

      inv.Products?.forEach((p) => {
        const price = p.price || 0;
        const cost = p.Cost || 0;
        const qty = p.quantity || 0;

        sales += price * qty;
        profit += (price - cost) * qty;
        map[date] += price * qty;
      });
    });

    setTotalSales(sales);
    setTotalProfit(profit);

    setSalesData(
      Object.keys(map).map((d) => ({ date: d, sales: map[d] }))
    );
  }, [invoices]);

  return (
    <div className="home">
      <h2 className="home-title">Bill<span style={{color:"rgb(205, 162, 7)"}}>Q</span></h2>

      <Row className="g-3 mb-4" >
        <Col xs={12} sm={6} md={4} lg={3}>
          <Card className="summary-card1" style={{
  background: "#2a2a2a",
  color: "#fff",
  padding: "40px",
  borderRadius: "15px",
  boxShadow: "6px 6px 14px rgba(0, 0, 0, 0.7), -4px -4px 10px rgba(255, 255, 255, 0.05)",
      }}>
            <h6>Total Invoices</h6>
            <h3>{invoices.length}</h3>
          </Card>
        </Col>

        <Col xs={12} sm={6} md={4} lg={3} >
          <Card className="summary-card1" style={{
  background: "#2a2a2a",
  color: "#fff",
  padding: "40px",
  borderRadius: "15px",
  boxShadow: "6px 6px 14px rgba(0, 0, 0, 0.7), -4px -4px 10px rgba(255, 255, 255, 0.05)",
      }}>
            <h6>Total Sales</h6>
            <h3>₹{totalSales.toFixed(2)}</h3>
          </Card>
        </Col>

        <Col xs={12} sm={6} md={4} lg={3}>
          <Card className="summary-card1" style={{
  background: "#2a2a2a",
  color: "#fff",
  padding: "40px",
  borderRadius: "15px",
  boxShadow: "6px 6px 14px rgba(0, 0, 0, 0.7), -4px -4px 10px rgba(255, 255, 255, 0.05)",
      }}>
            <h6>Average Sale</h6>
            <h3>
              ₹{invoices.length ? (totalSales / invoices.length).toFixed(2) : 0}
            </h3>
          </Card>
        </Col>

        <Col xs={12} sm={6} md={4} lg={3}>
          <Card className="summary-card1" style={{
  background: "#2a2a2a",
  color: "#fff",
  padding: "40px",
  borderRadius: "15px",
  boxShadow: "6px 6px 14px rgba(0, 0, 0, 0.7), -4px -4px 10px rgba(255, 255, 255, 0.05)",
      }}>
            <h6>Total Profit</h6>
            <h3>₹{totalProfit.toFixed(2)}</h3>
          </Card>
        </Col>
      </Row>

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
    </div>
  );
};

export default Home;
