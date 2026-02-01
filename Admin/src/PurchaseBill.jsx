import React, { useState, useEffect } from "react";
import { Card, Form, Button, Table, Modal } from "react-bootstrap";
import axios from "axios";
import { MdDeleteOutline } from "react-icons/md";
import Select from "react-select";
import { v4 as uuidv4 } from 'uuid';
import "./Css/Purchasebilling.css";
import { Html5Qrcode } from "html5-qrcode";

const PurchaseBill = () => {
  const [SupplierName, setSupplierName] = useState("");

  const [InvoiceNumber, setInvoiceNumber] = useState(``);
  const [date, setDate] = useState(new Date().toISOString().substr(0, 10));
  const [FetchedSuppliers, setFetchedSuppliers] = useState([]);
  const [Products, setProducts] = useState([]);
  const [SelectedProducts, setSelectedProducts] = useState([
    { productId: "", barcode: "", productName: "", Brand: "", unit: "", quantity: 1, cost: 0, tax: 0, rate: 0, MRP: 0, total: 0, search: "", selectedProduct: null },
  ]);


  const [SubTotal, setSubTotal] = useState(0);
  const [Tax, setTax] = useState(0);
  const [Discount, setDiscount] = useState(0);
  const [TotalAmount, setTotalAmount] = useState(0);
  const [PaymentMethod, setPaymentMethod] = useState("Cash");
  const [mrp, setmrp] = useState("");
  const [cost, setcost] = useState("");
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [scanRowIndex, setScanRowIndex] = useState(null);
  const html5QrCodeRef = React.useRef(null);

  const inputStyle = {
    backgroundColor: "#3a3a3a",
    border: "none",
    color: "#fff",
    borderRadius: "10px",
    height: "47px",
    boxShadow: "inset 3px 3px 6px rgba(0,0,0,0.6), inset -3px -3px 6px rgba(255,255,255,0.05)",
  };

  // Fetch products
  useEffect(() => {
    axios.get("https://billq-erp.onrender.com/Products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err));
  }, []);

  console.log(Products);



  // Fetch suppliers
  useEffect(() => {
    axios.get("https://billq-erp.onrender.com/Suppliers")
      .then((res) => setFetchedSuppliers(res.data))
      .catch((err) => console.error(err));
  }, []);

  // Update totals
  useEffect(() => {
    const subtotal = SelectedProducts.reduce((acc, item) => acc + item.total, 0);
    setSubTotal(subtotal);
    const total = subtotal + Number(Tax || 0) - Number(Discount || 0);
    setTotalAmount(total >= 0 ? total : 0);
  }, [SelectedProducts, Tax, Discount]);

  useEffect(() => {
    let subtotal = 0;
    let totalTax = 0;

    SelectedProducts.forEach(item => {
      subtotal += item.cost * item.quantity; // sum of costs only
      totalTax += (item.cost * (item.tax || 0) / 100) * item.quantity; // tax per item * quantity
    });

    setSubTotal(subtotal);
    setTax(totalTax); // this updates the summary Tax field
    const totalAmount = subtotal + totalTax - Number(Discount || 0);
    setTotalAmount(totalAmount >= 0 ? totalAmount : 0);
  }, [SelectedProducts, Discount]);

  const startBarcodeScanner = (rowIndex) => {
    setScanRowIndex(rowIndex);
    setShowScanner(true);

    setTimeout(() => {
      const scanner = new Html5Qrcode("purchase-barcode-reader");
      html5QrCodeRef.current = scanner;

      scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 280, height: 120 } },
        (decodedText) => {
          handleBarcodeChange(rowIndex, decodedText); // ✅ existing logic
          stopBarcodeScanner();
        },
        () => { }
      );
    }, 300);
  };

  const stopBarcodeScanner = () => {
    if (html5QrCodeRef.current) {
      html5QrCodeRef.current.stop().then(() => {
        html5QrCodeRef.current.clear();
        setShowScanner(false);
        setScanRowIndex(null);
      });
    }
  };




  // Handle barcode change
  const handleBarcodeChange = (index, value) => {
    const product = Products.find((p) => p.Barcode === value);
    if (product) {
      const existingIndex = SelectedProducts.findIndex(
        (item) => item.productId === product._id && item.rate === product.Cost
      );

      if (existingIndex !== -1) {
        const updated = [...SelectedProducts];
        updated[existingIndex].quantity += 1;
        updated[existingIndex].total = updated[existingIndex].quantity * updated[existingIndex].rate;
        setSelectedProducts(updated);
        return;
      }

      const updated = [...SelectedProducts];
      const cost = product.Cost || 0;
      const tax = 0;
      const rate = cost + (cost * tax / 100);

      const newRow = {
        ...updated[index],
        productId: product._id,
        productName: product.ProductName,
        cost,
        tax,
        rate,
        MRP: product.MRP || 0,
        unit: product.Unit || "",
        quantity: 1,
        total: rate,
        barcode: product.Barcode || "",
        Brand: product.Brand || "",
        search: product.ProductName,
        selectedProduct: { value: product._id, label: product.ProductName },
      };

      if (!updated[index].productId) {
        updated[index] = newRow;
      } else {
        updated.push(newRow);
      }

      setSelectedProducts(updated);
    } else {
      const updated = [...SelectedProducts];
      updated[index].barcode = value;
      setSelectedProducts(updated);
    }
  };







  // Handle select product
  const selectProduct = (index, product) => {
    const existingIndex = SelectedProducts.findIndex(
      (item) => item.productId === product._id && item.rate === product.Cost
    );

    if (existingIndex !== -1) {
      // Same product + same cost → increment quantity
      const updated = [...SelectedProducts];
      updated[existingIndex].quantity += 1;
      updated[existingIndex].total = updated[existingIndex].quantity * updated[existingIndex].rate;
      setSelectedProducts(updated);
      return;
    }

    const updated = [...SelectedProducts];

    const cost = product.Cost || 0;
    const tax = 0; // default 0%
    const rate = cost + (cost * tax / 100);

    const newRow = {
      ...updated[index], // preserve other fields if any
      productId: product._id,
      barcode: product.Barcode || "",
      productName: product.ProductName,
      Brand: product.Brand || "",
      unit: product.Unit || "",
      cost,
      tax,
      rate,
      MRP: product.MRP || 0,
      quantity: 1,
      total: rate,
      search: product.ProductName,
      selectedProduct: { value: product._id, label: product.ProductName + " (" + product.Brand + ")" },
    };

    if (!updated[index].productId) {
      // empty row → fill it
      updated[index] = newRow;
    } else {
      // row occupied → push new row
      updated.push(newRow);
    }

    setSelectedProducts(updated);
  };







  // Quantity change
  const handleQuantityChange = (index, value) => {
    const updated = [...SelectedProducts];
    updated[index].quantity = Number(value);
    updated[index].total = updated[index].quantity * updated[index].rate;
    setSelectedProducts(updated);
  };

  const handleCostChange = (index, value) => {
    const updated = [...SelectedProducts];
    updated[index].cost = Number(value);
    updated[index].rate = updated[index].cost + (updated[index].cost * (updated[index].tax || 0) / 100);
    updated[index].total = updated[index].quantity * updated[index].rate;
    setSelectedProducts(updated);
  };

  const handleTaxChange = (index, value) => {
    const updated = [...SelectedProducts];
    updated[index].tax = Number(value);
    updated[index].rate = updated[index].cost + (updated[index].cost * (updated[index].tax || 0) / 100);
    updated[index].total = updated[index].quantity * updated[index].rate;
    setSelectedProducts(updated);
  };

  const handleMRPChange = (index, value) => {
    const updated = [...SelectedProducts];
    updated[index].MRP = Number(value);
    setSelectedProducts(updated);
  };

  // Add/remove rows
  const addRow = () => {
    setSelectedProducts([
      ...SelectedProducts,
      { productId: "", barcode: "", productName: "", unit: "", quantity: 1, rate: 0, total: 0, search: "", selectedProduct: null },
    ]);
  };

  const removeRow = (index) => {
    const updated = [...SelectedProducts];
    updated.splice(index, 1);
    setSelectedProducts(updated);
  };

  // Submit 
  const handleSubmit = async () => {

    const validProducts = SelectedProducts.filter(
      (p) => p.productId && p.quantity > 0 && p.rate > 0
    );

    // ❌ Basic validation
    if (!SupplierName.trim() || validProducts.length === 0) {
      setShowWarningModal(true);
      return;
    }

    // ❌ MRP validation (THIS IS NEW)
    const mrpMissing = validProducts.some(
      (p) => !p.MRP || Number(p.MRP) <= 0
    );

    if (mrpMissing) {
      setShowWarningModal(true);
      return;
    }

    // ✅ Continue if everything is valid
    const subtotal = validProducts.reduce((acc, p) => acc + p.rate * p.quantity, 0);
    const totalAmount = subtotal + Number(Tax || 0) - Number(Discount || 0);

    const productsToSave = validProducts.map(p => ({
      Barcode: p.barcode || null,
      productId: p.productId,
      name: p.productName,
      quantity: Number(p.quantity),
      Unit: p.unit,
      price: Number(p.rate),
      Cost: p.rate,
      MRP: p.MRP,
      Brand: p.Brand || "",
    }));

    const billData = {
      InvoiceNumber,
      date,
      SupplierName,
      Stocks: productsToSave,
      Subtotal: subtotal,
      Tax,
      Discount,
      PaymentMethod,
      TotalAmount: totalAmount,
    };

    try {
      await axios.post("https://billq-erp.onrender.com/createpurchaseinvoice", billData);
      setShowSuccessModal(true);

      // Reset
      setInvoiceNumber("");
      setSelectedProducts([
        { productId: "", barcode: "", productName: "", unit: "", quantity: 1, cost: 0, tax: 0, rate: 0, MRP: 0, total: 0, search: "", selectedProduct: null },
      ]);
      setSupplierName("");
      setTax(0);
      setDiscount(0);
    } catch (err) {
      console.error("Error saving invoice:", err);
    }
  };





  return (
    <div
      className="billing"
    >
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
          Purchase Billing
        </h2>

        <Form onSubmit={(e) => e.preventDefault()}>
          {/* Invoice & Date */}
          <div style={{ display: "flex", gap: "20px" }}>
            <Form.Group style={{ width: "50%" }} className="mb-4">
              <Form.Label>Invoice Number</Form.Label>
              <Form.Control onChange={(e) => setInvoiceNumber(e.target.value)} type="text" value={InvoiceNumber} style={inputStyle} />
            </Form.Group>
            <Form.Group style={{ width: "50%" }} className="mb-4">
              <Form.Label>Date</Form.Label>
              <Form.Control type="date" value={date} onChange={(e) => setDate(e.target.value)} style={inputStyle} />
            </Form.Group>
          </div>

          {/* Supplier Info */}
          <div style={{ display: "flex", gap: "20px" }}>
            <Form.Group style={{ width: "100%" }} className="mb-4">
              <Form.Label>Supplier Name</Form.Label>
              <Form.Select value={SupplierName} onChange={(e) => setSupplierName(e.target.value)} style={inputStyle}>
                <option value="">Select a Supplier</option>
                {FetchedSuppliers.map((sup) => (
                  <option key={sup._id} value={sup.SupplierName}>
                    {sup.SupplierName}
                  </option>
                ))}
              </Form.Select>
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
                  <th>Cost</th>
                  <th>Tax (%)</th>
                  <th>Rate</th>
                  <th>MRP</th>
                  <th>Total</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {SelectedProducts.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>
                      <div style={{ position: "relative" }}>
                        <Form.Control
                          type="text"
                          value={item.barcode}
                          onChange={(e) => handleBarcodeChange(index, e.target.value)}
                          placeholder="Enter Barcode"
                          style={{
                            ...inputStyle,
                            paddingRight: "45px",
                            width: "180px",
                          }}
                        />

                        <Button
                          variant="link"
                          onClick={() => startBarcodeScanner(index)}
                          style={{
                            position: "absolute",
                            right: "8px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            padding: 0,
                            fontSize: "18px",
                            color: "#bbb",
                            textDecoration: "none",
                          }}
                        >
                          📷
                        </Button>
                      </div>

                    </td>
                    <td>
                      <Select
                        value={item.selectedProduct || null}
                        onChange={(selectedOption) => {
                          const selected = Products.find(p => p._id === selectedOption.value);
                          if (selected) selectProduct(index, selected);
                        }}
                        options={Products.map(p => ({
                          value: p._id,
                          label: `${p.ProductName} (${p.Brand || "No Barcode"})`,
                        }))}
                        placeholder="Search or Select Product..."
                        isSearchable
                        menuPortalTarget={document.body}   // ✅ KEY FIX
                        menuPosition="fixed"
                        styles={{
                          control: (base, state) => ({
                            ...base,
                            backgroundColor: "#3a3a3a",
                            border: state.isFocused ? "1px solid #777" : "none",
                            borderRadius: "10px",
                            color: "#fff",
                            height: "47px",
                            width: "280px",
                            boxShadow: "inset 3px 3px 6px rgba(0,0,0,0.6), inset -3px -3px 6px rgba(255,255,255,0.05)",
                          }),
                          input: (base) => ({ ...base, color: "#fff" }),
                          singleValue: (base) => ({ ...base, color: "#fff" }),
                          placeholder: (base) => ({ ...base, color: "#aaa" }),
                          menuPortal: (base) => ({
                            ...base,
                            zIndex: 9999, // 🔥 ensure it's on top
                          }),
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
                    <td>
                      <Form.Control
                        type="number"
                        value={item.cost}
                        onChange={(e) => handleCostChange(index, e.target.value)}
                        placeholder="Cost"
                        style={{ ...inputStyle, width: "60px" }}
                      />
                    </td>
                    <td>
                      <Form.Control
                        type="number"
                        value={item.tax}
                        onChange={(e) => handleTaxChange(index, e.target.value)}
                        placeholder="Tax %"
                        style={{ ...inputStyle, width: "60px" }}
                      />
                    </td>
                    <td>{item.rate.toFixed(2)}</td>
                    <td>
                      <Form.Control
                        type="number"
                        value={item.MRP}
                        onChange={(e) => handleMRPChange(index, e.target.value)}
                        placeholder="MRP"
                        style={{ ...inputStyle, width: "60px" }}
                      />
                    </td>
                    <td>{item.total}</td>
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
              style={{
                border: "none",
                padding: "8px 10px",
                borderRadius: "12px",
                background: "linear-gradient(145deg, #3a3a3a, #1e1e1e)",
                fontWeight: "600",
                boxShadow:
                  "4px 4px 8px rgba(0,0,0,0.8), -3px -3px 6px rgba(255,255,255,0.05)",
                transition: "0.3s",
              }}
              onClick={addRow}
            >
              + Add Product
            </Button>
          </div>

          {/* Summary */}
          <div style={{ marginTop: "40px", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
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
              <Form.Select value={PaymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} style={inputStyle}>
                <option>Cash</option>
                <option>Card</option>
                <option>UPI</option>
              </Form.Select>
            </Form.Group>
          </div>

          <div style={{ display: "flex", justifyContent: "center", marginTop: "30px" }}>
            <Button
              className="submit-button"
              type="button"
              onClick={handleSubmit}
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
              Save & Print
            </Button>
          </div>
        </Form>

        {/* Warning Modal */}
        <Modal show={showWarningModal} onHide={() => setShowWarningModal(false)} centered>
          <Modal.Body style={{
            background: "#272727ff",
            color: "white",
            textAlign: "center",
            padding: "25px",
          }}>
            <h5 style={{ padding: "10px" }}>Warning</h5>
            <p style={{ padding: "15px" }}>Please fill all fields and add at least one product.</p>

            <Button style={{ padding: "6px 30px" }} variant="danger" onClick={() => setShowWarningModal(false)}>
              OK
            </Button>
          </Modal.Body>
        </Modal>

        <Modal show={showScanner} onHide={stopBarcodeScanner} centered size="lg">
          <Modal.Body
            style={{
              background: "#111",
              color: "#fff",
              textAlign: "center",
            }}
          >
            <h5>Scan Product Barcode</h5>

            <div
              id="purchase-barcode-reader"
              style={{ width: "100%", minHeight: "300px", marginTop: "15px" }}
            />

            <Button
              variant="danger"
              style={{ marginTop: "15px" }}
              onClick={stopBarcodeScanner}
            >
              Cancel
            </Button>
          </Modal.Body>
        </Modal>


        {/* Success Modal */}
        <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)} centered>
          <Modal.Body style={{
            background: "#272727ff",
            color: "white",
            textAlign: "center",
            padding: "25px",
          }}>
            <h5 style={{ padding: "10px" }}>Success</h5>
            <p style={{ padding: "15px" }}>Purchase invoice saved successfully!</p>
            <Button style={{ padding: "6px 30px" }} variant="success" onClick={() => setShowSuccessModal(false)}>
              OK
            </Button>
          </Modal.Body>
        </Modal>
      </Card>
    </div>
  );
};

export default PurchaseBill;
