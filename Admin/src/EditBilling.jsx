import React, { useState, useEffect, useRef } from "react";
import { Card, Form, Button, Table, Modal } from "react-bootstrap";
import axios from "axios";
import { MdDeleteOutline } from "react-icons/md";
import { useParams, useNavigate } from "react-router-dom";
import "./Css/AddProducts.css";
import "./Css/Billing.css";
import Select from "react-select";
import { Html5Qrcode } from "html5-qrcode";
import { useAuth } from "./AuthProvider";

const EMPTY_ROW = {
  productId: "",
  barcode: "",
  name: "",
  Brand: "",
  unit: "",
  quantity: 1,
  price: 0,
  cost: 0,
  discount: 0,
  total: 0,
};

const EditBilling = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [CustomerName, setCustomerName] = useState("");
  const [CustomerNumber, setCustomerNumber] = useState("");
  const [InvoiceNumber, setInvoiceNumber] = useState("");
  const [date, setdate] = useState(new Date().toISOString().substr(0, 10));

  const [SelectedStocks, setSelectedStocks] = useState([{ ...EMPTY_ROW }]);

  const [PaymentMethod, setPaymentMethod] = useState("Cash");
  const [SubTotal, setSubTotal] = useState(0);
  const [Tax, setTax] = useState(0);
  const [Discount, setDiscount] = useState(0);
  const [TotalAmount, setTotalAmount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [FetchedCustomer, setFetchedCustomers] = useState([]);
  const [CustomerId, setCustomerId] = useState("");
  const [Stocks, setStocks] = useState([]);
  const [showScanner, setShowScanner] = useState(false);
  const html5QrCodeRef = useRef(null);

  const authHeader = { headers: { Authorization: `Bearer ${user.token}` } };

  // Fetch Stocks
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/stocks`, authHeader)
      .then((res) => setStocks(res.data))
      .catch((err) => console.error(err));
  }, []);

  // Fetch Customers
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/Customers`, authHeader)
      .then((res) => setFetchedCustomers(res.data))
      .catch((err) => console.error(err));
  }, []);

  // Fetch the invoice being edited and pre-fill the form
  useEffect(() => {
    const loadInvoice = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/invoices/${id}`,
          authHeader
        );
        const inv = res.data;

        setInvoiceNumber(inv.InvoiceNumber || "");
        setdate(
          inv.date
            ? new Date(inv.date).toISOString().substr(0, 10)
            : new Date().toISOString().substr(0, 10)
        );
        setCustomerName(inv.CustomerName || "");
        setCustomerNumber(inv.CustomerNumber || "");
        setPaymentMethod(inv.PaymentMethod || "Cash");
        setTax(Number(inv.Tax || 0));

        const rows = (inv.Stocks || []).map((s, i) => {
          const quantity = Number(s.quantity);
          const price = Number(s.price);
          // The invoice stores one overall discount, so put it on the first row
          const discount = i === 0 ? Number(inv.Discount || 0) : 0;
          return {
            productId: s.productId,
            barcode: s.Barcode || "",
            name: s.name,
            Brand: s.Brand || "",
            unit: s.Unit || "",
            quantity,
            price,
            cost: Number(s.cost || 0),
            discount,
            total: quantity * price - discount,
            selectedProduct: {
              value: s.productId,
              label: `${s.name} (${s.Brand || "No Brand"})`,
            },
          };
        });

        setSelectedStocks(rows.length ? rows : [{ ...EMPTY_ROW }]);
      } catch (err) {
        console.error("Failed to load invoice:", err);
        alert("Failed to load invoice");
        navigate("/invoices");
      } finally {
        setLoading(false);
      }
    };

    loadInvoice();
  }, [id]);

  // Select the matching customer in the dropdown once both are loaded
  useEffect(() => {
    if (!CustomerName || !FetchedCustomer.length) return;
    const match = FetchedCustomer.find(
      (c) => (c.CustomerName ?? c.name) === CustomerName
    );
    if (match) setCustomerId(match._id);
  }, [FetchedCustomer, CustomerName]);

  // Update subtotal and total
  useEffect(() => {
    const sub = SelectedStocks.reduce((acc, item) => acc + (item.total || 0), 0);
    setSubTotal(sub);
    const totalDiscount = SelectedStocks.reduce(
      (acc, item) => acc + (item.discount || 0),
      0
    );
    setDiscount(totalDiscount);
    const total = sub + Number(Tax || 0);
    setTotalAmount(total >= 0 ? total : 0);
  }, [SelectedStocks, Tax]);

  const handleRowDiscountChange = (index, value) => {
    const updated = [...SelectedStocks];
    updated[index].discount = Number(value);
    updated[index].total =
      updated[index].quantity * updated[index].price - updated[index].discount;
    setSelectedStocks(updated);
  };

  const handleBarcodeChange = (index, value) => {
    const cleanBarcode = value.trim();
    const product = Stocks.find((p) => String(p.Barcode).trim() === cleanBarcode);
    const updated = [...SelectedStocks];

    if (product) {
      updated[index] = {
        ...updated[index],
        productId: product.productId || product._id,
        barcode: cleanBarcode,
        name: product.name,
        Brand: product.Brand || "",
        unit: product.Unit || "",
        price: Number(product.MRP),
        cost: Number(product.cost || 0),
        quantity: 1,
        discount: 0,
        total: Number(product.MRP),
        selectedProduct: {
          value: product._id,
          label: `${product.name} (${product.Brand || "No Brand"})`,
        },
      };
    } else {
      updated[index] = {
        ...updated[index],
        barcode: cleanBarcode,
        productId: "",
        name: "",
        Brand: "",
        unit: "",
        price: 0,
        cost: 0,
        quantity: 1,
        discount: 0,
        total: 0,
        selectedProduct: null,
      };
    }

    setSelectedStocks(updated);
  };

  const selectProduct = (index, product) => {
    const updated = [...SelectedStocks];
    updated[index] = {
      ...updated[index],
      productId: product.productId || product._id,
      barcode: product.Barcode || "",
      name: product.name,
      Brand: product.Brand || "",
      unit: product.Unit || "",
      price: Number(product.MRP),
      cost: Number(product.cost || 0),
      quantity: 1,
      discount: 0,
      total: Number(product.MRP),
      selectedProduct: {
        value: product._id,
        label: `${product.name} (${product.Brand || "No Brand"})`,
      },
    };
    setSelectedStocks(updated);
  };

  const handleQuantityChange = (index, value) => {
    const updated = [...SelectedStocks];
    updated[index].quantity = Number(value);
    updated[index].total =
      updated[index].quantity * updated[index].price - updated[index].discount;
    setSelectedStocks(updated);
  };

  const addRow = () => {
    setSelectedStocks([...SelectedStocks, { ...EMPTY_ROW }]);
  };

  const removeRow = (index) => {
    const updated = [...SelectedStocks];
    updated.splice(index, 1);
    setSelectedStocks(updated);
  };

  // 🖨️ Print popup
  const handlePrint = (billData) => {
    const iframe = document.createElement("iframe");
    iframe.style.position = "absolute";
    iframe.style.width = "0px";
    iframe.style.height = "0px";
    iframe.style.border = "0";
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(`<html>
        <head>
          <title>Invoice - ${billData.InvoiceNumber}</title>
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
                <p>Opposite GHSS High School Gate,<br>Mathamangalam,Kannur,Kerala<br>Phone: +918921628952<br>Email: studentshub@gmail.com</p>
              </div>
              <div>
                <h2>INVOICE</h2>
                <p><strong>No:</strong> ${billData.InvoiceNumber}<br><strong>Date:</strong> ${billData.date}</p>
              </div>
            </header>
            <section>
              <h3>Bill To:</h3>
              <p><strong>Customer Name: ${billData.CustomerName}</strong><br>Customer Phone: ${billData.CustomerNumber}</p>
            </section>
            <table class="invoice-table">
              <thead>
                <tr><th>#</th><th>Product</th><th>Qty</th><th>price</th><th>Total</th></tr>
              </thead>
              <tbody>
                ${billData.Stocks.map((p, i) => `
                  <tr>
                    <td>${i + 1}</td>
                    <td>${p.Brand} ${p.name}</td>
                    <td>${p.quantity}</td>
                    <td>${p.price.toFixed(2)}</td>
                    <td>${(p.quantity * p.price).toFixed(2)}</td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
            <section class="summary">
              <table>
                <tr><td>Subtotal:</td><td>${billData.Subtotal.toFixed(2)}</td></tr>
                <tr><td>Tax:</td><td>${Number(billData.Tax || 0).toFixed(2)}</td></tr>
                <tr><td>Discount:</td><td>-${Number(billData.Discount || 0).toFixed(2)}</td></tr>
                <tr class="total"><td>Total:</td><td>${billData.TotalAmount.toFixed(2)}</td></tr>
                <tr><td>Payment Method:</td><td>${billData.PaymentMethod}</td></tr>
              </table>
            </section>
            <footer><p>Thank you for shopping with us!</p><p>Visit again</p></footer>
          </div>
        </body>
      </html>`);

    doc.close();
    iframe.contentWindow.focus();
    iframe.contentWindow.print();

    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 1000);
  };

  const startScanner = (rowIndex) => {
    setShowScanner(true);

    setTimeout(() => {
      const scanner = new Html5Qrcode("barcode-scanner");
      html5QrCodeRef.current = scanner;

      scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 100 } },
        (decodedText) => {
          handleBarcodeChange(rowIndex, decodedText);
          scanner.stop().then(() => {
            scanner.clear();
            setShowScanner(false);
          });
        },
        () => {}
      );
    }, 300);
  };

  const stopScanner = () => {
    if (html5QrCodeRef.current) {
      html5QrCodeRef.current.stop().then(() => {
        html5QrCodeRef.current.clear();
        setShowScanner(false);
      });
    }
  };

  const handleSubmit = async () => {
    const validStocks = SelectedStocks.filter(
      (p) => p.productId && p.quantity > 0 && p.price > 0
    );

    if (!CustomerName.trim() || validStocks.length === 0) {
      setShowModal(false);
      setShowWarningModal(true);
      return;
    }

    const subtotal = validStocks.reduce((acc, p) => acc + p.price * p.quantity, 0);
    const totalAmount = subtotal + Number(Tax || 0) - Number(Discount || 0);

    const StocksToSave = validStocks.map((p) => {
      const stock = Stocks.find(
        (s) => s.productId === p.productId || s._id === p.productId
      );
      const cost = Number(p.cost || 0);

      return {
        Barcode: p.barcode,
        productId: p.productId,
        name: p.name,
        Brand: p.Brand || stock?.Brand || "",
        quantity: Number(p.quantity),
        Unit: p.unit,
        price: Number(p.price),
        cost,
        profit: (Number(p.price) - cost) * Number(p.quantity),
      };
    });

    const billData = {
      InvoiceNumber,
      date,
      CustomerName,
      CustomerNumber,
      Stocks: StocksToSave,
      Subtotal: subtotal,
      Tax,
      Discount,
      PaymentMethod,
      TotalAmount: totalAmount,
    };

    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/invoices/${id}`,
        billData,
        authHeader
      );

      setShowModal(false);
      setShowSuccessModal(true);
      handlePrint(billData);
    } catch (error) {
      console.error("❌ EDIT BILLING ERROR:", error.response?.data || error);
      setShowModal(false);
      alert(error.response?.data?.message || "Failed to update invoice");
    }
  };

  const inputStyle = {
    border: "none",
    borderRadius: "10px",
    padding: "12px",
    color: "#fff",
    background: "#3a3a3a",
    boxShadow:
      "inset 3px 3px 6px rgba(0,0,0,0.6), inset -3px -3px 6px rgba(255,255,255,0.05)",
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-warning" role="status"></div>
      </div>
    );
  }

  return (
    <div className="billing">
      <Card
        style={{
          width: "1100px",
          padding: "40px",
          borderRadius: "20px",
          background: "#2a2a2a",
          boxShadow: "8px 8px 16px rgba(0,0,0,0.7), -4px -4px 12px rgba(255,255,255,0.05)",
          color: "#fff",
          margin: "10px 0",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "30px",
            fontWeight: "600",
            color: "#e6e6e6",
            textShadow: "0 0 6px rgba(255,255,255,0.1)",
          }}
        >
          Edit Invoice
        </h2>

        <Form
          onSubmit={(e) => {
            e.preventDefault();
            setShowModal(true);
          }}
        >
          {/* Invoice & Date */}
          <div style={{ display: "flex", gap: "20px" }}>
            <Form.Group style={{ width: "50%" }} className="mb-4">
              <Form.Label>Invoice Number</Form.Label>
              <Form.Control type="text" value={InvoiceNumber} readOnly style={inputStyle} />
            </Form.Group>
            <Form.Group style={{ width: "50%" }} className="mb-4">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                value={date}
                onChange={(e) => setdate(e.target.value)}
                style={inputStyle}
              />
            </Form.Group>
          </div>

          {/* Customer Info */}
          <div style={{ display: "flex", gap: "20px" }}>
            <Form.Group style={{ width: "50%" }} className="mb-4">
              <Form.Label>Customer Name</Form.Label>
              <Form.Select
                value={CustomerId}
                onChange={(e) => {
                  const cid = e.target.value;
                  setCustomerId(cid);
                  const selectedCustomer = FetchedCustomer.find((c) => c._id === cid);

                  if (selectedCustomer) {
                    setCustomerName(selectedCustomer.CustomerName ?? selectedCustomer.name ?? "");
                    setCustomerNumber(selectedCustomer.CustomerNumber ?? selectedCustomer.number ?? "");
                  } else {
                    setCustomerName("");
                    setCustomerNumber("");
                  }
                }}
                style={inputStyle}
              >
                <option value="" disabled>
                  {CustomerName || "Select a Customer"}
                </option>
                {FetchedCustomer.map((cust) => (
                  <option key={cust._id} value={cust._id}>
                    {cust.CustomerName ?? cust.name ?? "Unnamed"}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group style={{ width: "50%" }} className="mb-4">
              <Form.Label>Customer Phone</Form.Label>
              <Form.Control
                type="text"
                value={CustomerNumber}
                onChange={(e) => setCustomerNumber(e.target.value)}
                style={inputStyle}
              />
            </Form.Group>
          </div>

          {/* Product Table */}
          <div className="product-table-wrapper">
            <Table striped bordered hover variant="dark" className="product-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Barcode</th>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Unit</th>
                  <th>Price</th>
                  <th>Total</th>
                  <th>Discount</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {SelectedStocks.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>
                      <div style={{ position: "relative", width: "180px" }}>
                        <Form.Control
                          type="text"
                          value={item.barcode}
                          onChange={(e) => handleBarcodeChange(index, e.target.value)}
                          placeholder="Enter Barcode"
                          style={{
                            ...inputStyle,
                            paddingRight: "42px",
                            height: "47px",
                            width: "100%",
                          }}
                        />
                        <div
                          onClick={() => startScanner(index)}
                          style={{
                            position: "absolute",
                            right: "10px",
                            top: "0",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            cursor: "pointer",
                            color: "#bbb",
                            zIndex: 5,
                          }}
                          title="Scan barcode"
                        >
                          📷
                        </div>
                      </div>
                    </td>

                    <td style={{ position: "relative" }}>
                      <Select
                        value={item.selectedProduct || null}
                        onChange={(selectedOption) => {
                          const selected = Stocks.find((p) => p._id === selectedOption.value);
                          if (selected) selectProduct(index, selected);
                        }}
                        options={Stocks.map((p) => ({
                          value: p._id,
                          label: `${p.name} (${p.Brand || "No Brand"})`,
                        }))}
                        placeholder="Search or Select Product..."
                        isSearchable={true}
                        menuPortalTarget={document.body}
                        menuPosition="fixed"
                        filterOption={(option, inputValue) => {
                          const search = inputValue.toLowerCase();
                          const [name] = option.label.toLowerCase().split("(");
                          return name.includes(search);
                        }}
                        styles={{
                          control: (base, state) => ({
                            ...base,
                            backgroundColor: "#3a3a3a",
                            border: state.isFocused ? "1px solid #777" : "none",
                            borderRadius: "10px",
                            color: "#fff",
                            height: "47px",
                            width: "280px",
                            boxShadow:
                              "inset 3px 3px 6px rgba(0,0,0,0.6), inset -3px -3px 6px rgba(255,255,255,0.05)",
                          }),
                          input: (base) => ({ ...base, color: "#fff" }),
                          singleValue: (base) => ({ ...base, color: "#fff" }),
                          placeholder: (base) => ({ ...base, color: "#aaa" }),
                          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                          menu: (base) => ({
                            ...base,
                            backgroundColor: "#2e2e2e",
                            color: "#fff",
                            zIndex: 20,
                          }),
                          menuList: (base) => ({
                            ...base,
                            maxHeight: "260px",
                            overflowY: "auto",
                            paddingTop: 0,
                            paddingBottom: 0,
                          }),
                          option: (base, state) => ({
                            ...base,
                            backgroundColor: state.isFocused ? "#555" : "#2e2e2e",
                            color: "#fff",
                            cursor: "pointer",
                            padding: "10px 12px",
                          }),
                        }}
                      />
                    </td>

                    <td>
                      <Form.Control
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(index, e.target.value)}
                        style={{ ...inputStyle, width: "80px" }}
                      />
                    </td>
                    <td>{item.unit}</td>
                    <td>{item.price}</td>
                    <td>{item.total}</td>
                    <td>
                      <Form.Control
                        type="number"
                        value={item.discount}
                        onChange={(e) => handleRowDiscountChange(index, e.target.value)}
                        style={{ ...inputStyle, width: "80px" }}
                      />
                    </td>
                    <td>
                      <Button variant="danger" onClick={() => removeRow(index)}>
                        <MdDeleteOutline />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <Button
              className="submit-button"
              style={{
                border: "none",
                padding: "8px 10px",
                borderRadius: "12px",
                background: "linear-gradient(145deg, #3a3a3a, #1e1e1e)",
                fontWeight: "600",
                boxShadow: "4px 4px 8px rgba(0,0,0,0.8), -3px -3px 6px rgba(255,255,255,0.05)",
                transition: "0.3s",
              }}
              onClick={addRow}
            >
              + Add Product
            </Button>
          </div>

          {/* Summary */}
          <div
            style={{
              marginTop: "40px",
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "20px",
            }}
          >
            <Form.Group>
              <Form.Label>Subtotal</Form.Label>
              <Form.Control type="number" value={SubTotal} readOnly style={inputStyle} />
            </Form.Group>

            <Form.Group>
              <Form.Label>Tax</Form.Label>
              <Form.Control
                type="number"
                value={Tax}
                onChange={(e) => setTax(Number(e.target.value))}
                style={inputStyle}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Discount</Form.Label>
              <Form.Control
                type="number"
                value={Discount}
                onChange={(e) => setDiscount(Number(e.target.value))}
                style={inputStyle}
              />
            </Form.Group>

            <Form.Group style={{ gridColumn: "span 1" }}>
              <Form.Label>Total</Form.Label>
              <Form.Control type="number" value={TotalAmount} readOnly style={inputStyle} />
            </Form.Group>

            <Form.Group style={{ gridColumn: "span 2" }}>
              <Form.Label>Payment Method</Form.Label>
              <Form.Select
                value={PaymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                style={inputStyle}
              >
                <option>Cash</option>
                <option>Card</option>
                <option>UPI</option>
                <option>Credit</option>
              </Form.Select>
            </Form.Group>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "20px",
              marginTop: "30px",
            }}
          >
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate("/invoices")}
              style={{ border: "none", padding: "12px 40px", borderRadius: "12px", fontWeight: "600" }}
            >
              Cancel
            </Button>
            <Button
              className="submit-button"
              type="submit"
              style={{
                border: "none",
                padding: "12px 40px",
                borderRadius: "12px",
                background: "linear-gradient(145deg, #3a3a3a, #1e1e1e)",
                fontWeight: "600",
                boxShadow: "4px 4px 8px rgba(0,0,0,0.8), -3px -3px 6px rgba(255,255,255,0.05)",
                transition: "0.3s",
              }}
            >
              Update & Print
            </Button>
          </div>
        </Form>

        {/* Confirm Save */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Body style={{ background: "#272727ff", color: "white", textAlign: "center" }}>
            <h5 style={{ padding: "10px" }}>Confirm </h5>
            <p style={{ padding: "20px" }}>Do you want to update this invoice?</p>
            <Button style={{ marginRight: "10px" }} variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              Yes, Update
            </Button>
          </Modal.Body>
        </Modal>

        {/* Scanner */}
        <Modal show={showScanner} onHide={stopScanner} centered size="lg">
          <Modal.Body style={{ background: "#111", color: "#fff", textAlign: "center" }}>
            <h5>Scan Barcode</h5>
            <div
              id="barcode-scanner"
              style={{ width: "100%", minHeight: "300px", marginTop: "15px" }}
            />
            <Button variant="danger" style={{ marginTop: "15px" }} onClick={stopScanner}>
              Cancel
            </Button>
          </Modal.Body>
        </Modal>

        {/* Warning */}
        <Modal show={showWarningModal} onHide={() => setShowWarningModal(false)} centered>
          <Modal.Body style={{ background: "#272727ff", color: "white", textAlign: "center" }}>
            <h5 style={{ padding: "10px" }}>Warning </h5>
            <p style={{ padding: "15px" }}>Please fill all fields and add at least one product.</p>
            <Button style={{ padding: "6px 30px" }} variant="danger" onClick={() => setShowWarningModal(false)}>
              OK
            </Button>
          </Modal.Body>
        </Modal>

        {/* Success */}
        <Modal
          show={showSuccessModal}
          onHide={() => {
            setShowSuccessModal(false);
            navigate("/invoices");
          }}
          centered
        >
          <Modal.Body style={{ background: "#272727ff", color: "white", textAlign: "center" }}>
            <h5 style={{ padding: "10px" }}>Success</h5>
            <p style={{ padding: "15px" }}>Invoice updated and printed successfully!</p>
            <Button
              variant="success"
              onClick={() => {
                setShowSuccessModal(false);
                navigate("/invoices");
              }}
            >
              OK
            </Button>
          </Modal.Body>
        </Modal>
      </Card>
    </div>
  );
};

export default EditBilling;