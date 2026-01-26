import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import { Table, Card, Button, Modal } from "react-bootstrap";
import { MdPrint } from "react-icons/md";
import "./Css/Purchaseinvoices.css";

const Purchaseinvoices = () => {
  const [Invoices, setInvoices] = useState([]);

  console.log(Invoices);
  


  useEffect(() => {
    axios.get("https://billq-erp.onrender.com/purchaseinvoices")
      .then((response) => {
        setInvoices(response.data);
      })
      .catch((error) => {
        console.error("Error fetching invoices:", error);
      });
    
  }, [])
  


  return (
    <div className="purchaseinvoices">
    

      <Card style={{ width: "100%", maxWidth: "calc(100% - 40px)", background: "#2a2a2a", borderRadius: "20px", padding: "20px", boxShadow: "8px 8px 16px rgba(0,0,0,0.7), -8px -8px 16px rgba(255,255,255,0.05)", color: "#fff", overflow: "hidden" }}>
        <h2 style={{ color: "#e6e6e6", textShadow: "0 0 6px rgba(255,255,255,0.1)", marginBottom: "20px" }}>Invoices</h2>
        <div style={{ overflowX: "auto" }}>
          <Table striped bordered hover variant="dark" style={{ width: "100%", background: "#3a3a3a", borderRadius: "15px", boxShadow: "inset 3px 3px 6px rgba(0,0,0,0.6), inset -3px -3px 6px rgba(255,255,255,0.05)", tableLayout: "auto", whiteSpace: "nowrap" }}>
            <thead>
              <tr>
                <th>Invoice No</th>
                <th>Date</th>
                <th>Supplier</th>
                <th>Products</th>
                <th>Quantities</th>
                <th>Units</th>
                <th>Prices</th>
                <th>SubTotal</th>
                <th>Tax</th>
                <th>Discount</th>
                <th>Total</th>
                <th>Payment Method</th>
              </tr>
            </thead>
            <tbody>
              {Invoices.length > 0 ? (
                Invoices.map((invoice) => (
                  <tr key={invoice._id}>
                    <td>{invoice.InvoiceNumber}</td>
                    <td>{invoice.date ? new Date(invoice.date).toLocaleDateString("en-GB") : ""}</td>
                    <td>{invoice.SupplierName}</td>
                    <td><div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>{invoice.Stocks?.map((p, i) => <span key={i}>{p.name}</span>)}</div></td>
                    <td><div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>{invoice.Stocks?.map((p, i) => <span key={i}>{p.quantity}</span>)}</div></td>
                    <td><div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>{invoice.Stocks?.map((p, i) => <span key={i}>{p.Unit}</span>)}</div></td>
                    <td><div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>{invoice.Stocks?.map((p, i) => <span key={i}>{p.price?.toFixed(2)}</span>)}</div></td>
                    
                   
                    <td>{(invoice.Subtotal || 0).toFixed(2)}</td>
                    <td>{(invoice.Tax || 0).toFixed(2)}</td>
                     <td>{(invoice.Discount || 0).toFixed(2)}</td>
                    <td>{(invoice.TotalAmount || 0).toFixed(2)}</td>
                    <td>{invoice.PaymentMethod}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={13} style={{ textAlign: "center" }}>No Invoices found</td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </Card>
    </div>
  );
};

export default Purchaseinvoices;
