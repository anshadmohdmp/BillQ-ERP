import axios from "axios";
import React, { useEffect, useState } from "react";
import { Table, Card, Button } from "react-bootstrap";
import "./Css/Credits.css";

const Credits = () => {
    const [Credits, setCredits] = useState([]);
    const [paymentMethodSelection, setPaymentMethodSelection] = useState({}); // { invoiceId: selectedMethod }

    useEffect(() => {
        fetchCredits();
    }, []);

    const fetchCredits = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/credits`);
            setCredits(response.data);
        } catch (error) {
            console.error("Error fetching Credits:", error);
        }
    };

    const handlePaymentMethodChange = (invoiceId, method) => {
        setPaymentMethodSelection((prev) => ({
            ...prev,
            [invoiceId]: method,
        }));
    };

    const handlePayment = async (invoiceId) => {
        const selectedMethod = paymentMethodSelection[invoiceId] || "Credit";

        try {
            await axios.put(
                `${import.meta.env.VITE_API_URL}/invoices/${invoiceId}/paymentMethod`,
                { paymentMethod: selectedMethod }
            );

            // Update local state
            setCredits((prev) =>
                prev.map((c) =>
                    c._id === invoiceId
                        ? { ...c, PaymentStatus: selectedMethod === "Credit" ? "Not Paid" : "Paid" }
                        : c
                )
            );
        } catch (err) {
            console.error("Failed to update payment:", err);
            alert("❌ Failed to update payment");
        }
    };




    return (
        <div
            className="credits"
        >
            <Card
                style={{
                    width: "100%",
                    background: "#2a2a2a",
                    borderRadius: "20px",
                    padding: "20px",
                    boxShadow:
                        "8px 8px 16px rgba(0,0,0,0.7), -8px -8px 16px rgba(255,255,255,0.05)",
                    color: "#fff",
                    overflow: "hidden",
                }}
            >
                <h2
                    style={{
                        color: "#e6e6e6",
                        textShadow: "0 0 6px rgba(255,255,255,0.1)",
                        marginBottom: "20px",
                    }}
                >
                    Sales Credits
                </h2>
                <div style={{ overflowX: "auto" }}>
                    <Table
                        striped
                        bordered
                        hover
                        variant="dark"
                        style={{
                            width: "100%",
                            background: "#3a3a3a",
                            borderRadius: "15px",
                            boxShadow:
                                "inset 3px 3px 6px rgba(0,0,0,0.6), inset -3px -3px 6px rgba(255,255,255,0.05)",
                            tableLayout: "auto",
                            whiteSpace: "nowrap",
                        }}
                    >
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
                                <th>Payment Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Credits.length > 0 ? (
                                Credits.map((invoice) => {
                                    const selectedMethod = paymentMethodSelection[invoice._id] || "Credit";
                                    const isButtonEnabled = selectedMethod !== "Credit";

                                    return (
                                        <tr key={invoice._id}>
                                            <td>{invoice.InvoiceNumber}</td>
                                            <td>
                                                {invoice.date
                                                    ? new Date(invoice.date).toLocaleDateString("en-GB")
                                                    : ""}
                                            </td>
                                            <td>{invoice.CustomerName}</td>
                                            <td>{invoice.CustomerNumber}</td>
                                            <td>
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        gap: "4px",
                                                    }}
                                                >
                                                    {invoice.Stocks?.map((p, i) => (
                                                        <span key={i}>{p.name}</span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td>
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        gap: "4px",
                                                    }}
                                                >
                                                    {invoice.Stocks?.map((p, i) => (
                                                        <span key={i}>{p.quantity}</span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td>
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        gap: "4px",
                                                    }}
                                                >
                                                    {invoice.Stocks?.map((p, i) => (
                                                        <span key={i}>{p.Unit}</span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td>
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        gap: "4px",
                                                    }}
                                                >
                                                    {invoice.Stocks?.map((p, i) => (
                                                        <span key={i}>{p.price?.toFixed(2)}</span>
                                                    ))}
                                                </div>
                                            </td>

                                            <td>{(invoice.Subtotal || 0).toFixed(2)}</td>
                                            <td>{(invoice.Tax || 0).toFixed(2)}</td>
                                            <td>{(invoice.Discount || 0).toFixed(2)}</td>
                                            <td>{(invoice.TotalAmount || 0).toFixed(2)}</td>

                                            {/* Payment Method Dropdown */}
                                            <td>
                                                <select
                                                    value={selectedMethod}
                                                    onChange={(e) => handlePaymentMethodChange(invoice._id, e.target.value)}
                                                >
                                                    <option value="Credit">Credit</option>
                                                    <option value="Cash">Cash</option>
                                                    <option value="UPI">UPI</option>
                                                    <option value="Card">Card</option>
                                                </select>

                                            </td>

                                            {/* Payment Status Button */}
                                            <td style={{ textAlign: "center" }}>
                                                <Button
                                                    onClick={() => handlePayment(invoice._id)}
                                                    disabled={!isButtonEnabled}
                                                    style={{
                                                        backgroundColor:
                                                            invoice.PaymentStatus === "Paid"
                                                                ? "green"
                                                                : "red",
                                                        color: "#fff",
                                                        border: "none",
                                                        borderRadius: "8px",
                                                        padding: "6px 12px",
                                                        cursor: isButtonEnabled ? "pointer" : "not-allowed",
                                                    }}
                                                >
                                                    {invoice.PaymentStatus === "Paid"
                                                        ? "Paid"
                                                        : "Not Paid"}
                                                </Button>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={14} style={{ textAlign: "center" }}>
                                        No Sales Credits found
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

export default Credits;
