import axios from "axios";
import React, { useEffect, useState } from "react";
import { Table, Card, Button, Modal } from "react-bootstrap";
import { MdPrint } from "react-icons/md";
import "./Css/Invoices.css";

const Invoices = () => {
  const [Invoices, setInvoices] = useState([]);
  const [showPrintConfirm, setShowPrintConfirm] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const response = await axios.get("https://billq-erp.onrender.com/invoices");
      setInvoices(response.data);
    } catch (error) {
      console.error("Error fetching invoices:", error);
    }
  };

  console.log(Invoices);
  

  const handlePrintConfirm = (_id) => {
    setSelectedInvoiceId(_id);
    setShowPrintConfirm(true);
  };

  const handlePrint = async () => {
    setShowPrintConfirm(false);
    try {
      const response = await axios.get(`https://billq-erp.onrender.com/invoices/${selectedInvoiceId}`);
      const billData = response.data;

      const Subtotal =
        billData.Subtotal ||
        billData.Products?.reduce((acc, p) => acc + (p.price || 0) * (p.quantity || 0), 0) ||
        0;
      const Tax = billData.Tax || 0;
      const TotalAmount = Subtotal + Tax;

      const iframe = document.createElement("iframe");
      iframe.style.position = "absolute";
      iframe.style.width = "0px";
      iframe.style.height = "0px";
      iframe.style.border = "0";
      document.body.appendChild(iframe);

      const doc = iframe.contentWindow.document;
      doc.open();
      doc.write(`
        <html>
        <head>
          <title>Invoice - ${billData.InvoiceNumber || selectedInvoiceId}</title>
          <style>
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
            body { font-family: "Poppins", sans-serif; color: #333; margin: 0; padding: 20px; background: #f5f5f5; }
            .invoice-box { background: #fff; padding: 40px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); width: 800px; margin: auto; }
            header { display: flex; justify-content: space-between; border-bottom: 2px solid #0c3e74; padding-bottom: 20px; }
            header h1 { color: #0c3e74; margin: 0; }
            .invoice-table { width: 100%; border-collapse: collapse; margin-top: 30px; }
            .invoice-table th { background: #0c3e74; color: #fff; padding: 10px; text-align: left; }
            .invoice-table td { border-bottom: 1px solid #ddd; padding: 10px; }
            .summary { width: 300px; margin-top: 30px; margin-left: auto; }
            .summary td { padding: 6px 0; }
            .summary .total td { font-weight: bold; border-top: 2px solid #0c3e74; padding-top: 8px; }
            footer { text-align: center; margin-top: 50px; border-top: 1px solid #ccc; padding-top: 10px; font-size: 14px; color: #777; }
          </style>
        </head>
        <body>
          <div class="invoice-box">
            <header>
              <div>
                <h1>Students Hub</h1>
                <p>Opposite High School Gate,<br>Mathamangalam,Kannur,Kerala<br>Phone: +918921628952<br>Email: studentshub@gmail.com</p>
              </div>
              <div>
                <h2>INVOICE</h2>
                <p><strong>No:</strong> ${billData.InvoiceNumber || selectedInvoiceId}<br>
                   <strong>Date:</strong> ${billData.date ? new Date(billData.date).toLocaleDateString("en-GB") : ""}</p>
              </div>
            </header>
            <section>
              <h3>Bill To:</h3>
              <p><strong>Customer Name: ${billData.CustomerName || ""}</strong><br>Customer Phone: ${billData.CustomerNumber || ""}</p>
            </section>
            <table class="invoice-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Product</th>
                  <th>Qty</th>
                  <th>Rate</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${billData.Products?.map((p, i) => `
                  <tr>
                    <td>${i + 1}</td>
                    <td>${p.name || ""}</td>
                    <td>${p.quantity || 0}</td>
                    <td>${p.price?.toFixed(2) || "0.00"}</td>
                    <td>${((p.quantity || 0) * (p.price || 0)).toFixed(2)}</td>
                  </tr>
                `).join("") || ""}
              </tbody>
            </table>
            <section class="summary">
              <table>
                <tr><td>Subtotal:</td><td>${Subtotal.toFixed(2)}</td></tr>
                <tr><td>Tax:</td><td>${Tax.toFixed(2)}</td></tr>
                <tr><td>Discount:</td><td>-${billData.Discount.toFixed(2)}</td></tr>
                <tr class="total"><td>Total:</td><td>${TotalAmount.toFixed(2)}</td></tr>
                <tr><td>Payment Method:</td><td>${billData.PaymentMethod || ""}</td></tr>
              </table>
            </section>
            <footer>
              <p>Thank you for shopping with us!</p>
              <p>Visit again</p>
            </footer>
          </div>
        </body>
        </html>
      `);
      doc.close();
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
      setTimeout(() => document.body.removeChild(iframe), 1000);
    } catch (err) {
      console.error("Failed to fetch invoice:", err);
      alert("❌ Failed to fetch invoice for printing.");
    }
  };

  return (
    <div className="invoices">
      {/* Print Confirmation Modal */}
      <Modal show={showPrintConfirm} onHide={() => setShowPrintConfirm(false)} centered>
        <Modal.Body
          style={{
            background: "#272727ff",
            color: "white",
            textAlign: "center",
            padding: "25px",
          }}
        >
          <h4>⚠️ Confirm Print</h4>
          <p style={{ color: "#ccc" }}>Are you sure you want to print this invoice?</p>
          <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginTop: "15px" }}>
            <Button
              variant="secondary"
              onClick={() => setShowPrintConfirm(false)}
              style={{ background: "#555", border: "none", borderRadius: "10px", padding: "8px 25px" }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handlePrint}
              style={{ background: "#2196f3", border: "none", borderRadius: "10px", padding: "8px 25px" }}
            >
              Print
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      <Card style={{ width: "100%", background: "#2a2a2a", borderRadius: "20px", padding: "20px", boxShadow: "8px 8px 16px rgba(0,0,0,0.7), -8px -8px 16px rgba(255,255,255,0.05)", color: "#fff", overflow: "hidden" }}>
        <h2 style={{ color: "#e6e6e6", textShadow: "0 0 6px rgba(255,255,255,0.1)", marginBottom: "20px" }}>Sales Invoices</h2>
        <div style={{ overflowX: "auto" }}>
          <Table striped bordered hover variant="dark" style={{ width: "100%", background: "#3a3a3a", borderRadius: "15px", boxShadow: "inset 3px 3px 6px rgba(0,0,0,0.6), inset -3px -3px 6px rgba(255,255,255,0.05)", tableLayout: "auto", whiteSpace: "nowrap" }}>
            <thead>
              <tr>
                <th>Invoice No</th>
                <th>Date</th>
                <th>Customer Name</th>
                <th>Customer Phone</th>
                <th>Products</th>
                <th>Quantities</th>
                <th>Units</th>
                <th>Prices</th>
                <th>SubTotal</th>
                <th>Tax</th>
                <th>Discount</th>
                <th>Total</th>
                <th>Payment Method</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {Invoices.length > 0 ? (
                Invoices.map((invoice) => (
                  <tr key={invoice._id}>
                    <td>{invoice.InvoiceNumber}</td>
                    <td>{invoice.date ? new Date(invoice.date).toLocaleDateString("en-GB") : ""}</td>
                    <td>{invoice.CustomerName}</td>
                    <td>{invoice.CustomerNumber}</td>
                    <td><div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>{invoice.Stocks?.map((p, i) => <span key={i}>{p.name}</span>)}</div></td>
                    <td><div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>{invoice.Stocks?.map((p, i) => <span key={i}>{p.quantity}</span>)}</div></td>
                    <td><div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>{invoice.Stocks?.map((p, i) => <span key={i}>{p.Unit}</span>)}</div></td>
                    <td><div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>{invoice.Stocks?.map((p, i) => <span key={i}>{p.price?.toFixed(2)}</span>)}</div></td>
                    
                   
                    <td>{(invoice.Subtotal || 0).toFixed(2)}</td>
                    <td>{(invoice.Tax || 0).toFixed(2)}</td>
                     <td>{(invoice.Discount || 0).toFixed(2)}</td>
                    <td>{(invoice.TotalAmount || 0).toFixed(2)}</td>
                    <td>{invoice.PaymentMethod}</td>
                    <td style={{ textAlign: "center", cursor: "pointer" }} onClick={() => handlePrintConfirm(invoice._id)}><MdPrint /> Print Invoice</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={14} style={{ textAlign: "center" }}>No Sales Invoices found</td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </Card>
    </div>
  );
};

export default Invoices;
