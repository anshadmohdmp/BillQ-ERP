import React, { useState, useEffect, useRef } from "react";
import { Card, Form, Button, Table, Modal } from "react-bootstrap";
import axios from "axios";
import { MdDeleteOutline } from "react-icons/md";
import "./Css/AddProducts.css";
import "./Css/Billing.css";
import Select from "react-select";
import { Html5Qrcode } from "html5-qrcode";

const Billing = () => {
  const [CustomerName, setCustomerName] = useState("");
  const [CustomerNumber, setCustomerNumber] = useState("");
  const [InvoiceNumber, setInvoiceNumber] = useState(`INV-${Math.floor(Math.random() * 100000)}`);
  const [date, setDate] = useState(new Date().toISOString().substr(0, 10));

  const [SelectedStocks, setSelectedStocks] = useState([
    { productId: "", barcode: "", name: "", unit: "", quantity: 1, price: 0, cost: 0, discount: 0, total: 0, profit: 0, search: "", showSuggestions: false },
  ]);

  const [PaymentMethod, setPaymentMethod] = useState("Cash");
  const [SubTotal, setSubTotal] = useState(0);
  const [Tax, setTax] = useState(0);
  const [Discount, setDiscount] = useState(0);
  const [TotalAmount, setTotalAmount] = useState(0);
  const [Profit, setProfit] = useState(0);

  const [showModal, setShowModal] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [FetchedCustomer, setFetchedCustomers] = useState([]);
  const [CustomerId, setCustomerId] = useState("");
  const [Stocks, setStocks] = useState([]);
  const [showScanner, setShowScanner] = useState(false);
  const html5QrCodeRef = useRef(null);
  const wrapperRefs = useRef([]);

  // Fetch Stocks
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/stocks`)
      .then(res => setStocks(res.data))
      .catch(err => console.error(err));
  }, []);

  // Fetch Customers
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/Customers`)
      .then(res => setFetchedCustomers(res.data))
      .catch(err => console.error(err));
  }, []);

  // Update totals & profit
  useEffect(() => {
    const sub = SelectedStocks.reduce((acc, item) => acc + item.total, 0);
    const totalDiscount = SelectedStocks.reduce((acc, item) => acc + item.discount, 0);
    const profit = SelectedStocks.reduce((acc, item) => acc + ((item.price - item.cost) * item.quantity), 0);

    setSubTotal(sub);
    setDiscount(totalDiscount);
    setProfit(profit);
    setTotalAmount(sub + Number(Tax || 0) - totalDiscount);
  }, [SelectedStocks, Tax]);

  // Close suggestions on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      wrapperRefs.current.forEach((ref, index) => {
        if (ref && !ref.contains(event.target)) {
          const updated = [...SelectedStocks];
          updated[index].showSuggestions = false;
          setSelectedStocks(updated);
        }
      });
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [SelectedStocks]);

  const handleStockSearch = (index, value) => {
    const updated = [...SelectedStocks];
    updated[index].search = value;
    updated[index].productId = "";
    updated[index].name = value;
    updated[index].price = 0;
    updated[index].total = 0;
    updated[index].unit = "";
    updated[index].barcode = "";
    updated[index].cost = 0;
    updated[index].showSuggestions = true;

    const product = Stocks.find(p => p.name.toLowerCase() === value.toLowerCase());
    if (product) {
      updated[index] = {
        ...updated[index],
        productId: product._id,
        barcode: product.Barcode || "",
        name: product.name,
        unit: product.Unit || "",
        price: product.MRP,
        cost: product.Cost || 0,
        quantity: 1,
        discount: 0,
        total: product.MRP,
        profit: product.MRP - (product.Cost || 0),
        showSuggestions: false,
      };
    }
    setSelectedStocks(updated);
  };

  const handleRowDiscountChange = (index, value) => {
    const updated = [...SelectedStocks];
    updated[index].discount = Number(value);
    updated[index].total = (updated[index].quantity * updated[index].price) - updated[index].discount;
    setSelectedStocks(updated);
  };

  const handleQuantityChange = (index, value) => {
    const updated = [...SelectedStocks];
    const qty = Number(value);
    updated[index].quantity = qty;
    updated[index].total = (qty * updated[index].price) - updated[index].discount;
    updated[index].profit = (updated[index].price - updated[index].cost) * qty;
    setSelectedStocks(updated);
  };

  const handleBarcodeChange = (index, value) => {
    const cleanBarcode = value.trim();
    const product = Stocks.find(p => String(p.Barcode).trim() === cleanBarcode);
    const updated = [...SelectedStocks];

    if (product) {
      updated[index] = {
        ...updated[index],
        productId: product._id,
        barcode: cleanBarcode,
        name: product.name,
        unit: product.Unit || "",
        price: product.MRP,
        cost: product.Cost || 0,
        quantity: 1,
        discount: 0,
        total: product.MRP,
        profit: product.MRP - (product.Cost || 0),
        search: product.name,
        showSuggestions: false,
      };
    } else {
      updated[index] = {
        ...updated[index],
        barcode: cleanBarcode,
        productId: "",
        name: "",
        unit: "",
        price: 0,
        cost: 0,
        quantity: 1,
        discount: 0,
        total: 0,
        profit: 0,
      };
    }
    setSelectedStocks(updated);
  };

  const selectProduct = (index, product) => {
    const updated = [...SelectedStocks];
    updated[index] = {
      ...updated[index],
      selectedProduct: { value: product._id, label: `${product.name} (${product.Brand || "No Brand"})` },
      productId: product._id,
      barcode: product.Barcode || "",
      name: product.name,
      price: product.MRP,
      cost: product.Cost || 0,
      unit: product.Unit || "",
      quantity: 1,
      discount: 0,
      total: product.MRP,
      profit: product.MRP - (product.Cost || 0),
      search: product.name,
      showSuggestions: false,
    };
    setSelectedStocks(updated);
  };

  const addRow = () => {
    setSelectedStocks([...SelectedStocks, { productId: "", barcode: "", name: "", unit: "", quantity: 1, price: 0, cost: 0, discount: 0, total: 0, profit: 0, search: "", showSuggestions: false }]);
  };

  const removeRow = (index) => {
    const updated = [...SelectedStocks];
    updated.splice(index, 1);
    setSelectedStocks(updated);
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

  // Save Invoice
  const handleSubmit = async () => {
    const validStocks = SelectedStocks.filter(p => p.productId && p.quantity > 0 && p.price > 0);

    if (!CustomerName.trim() || validStocks.length === 0) {
      setShowModal(false);
      setShowWarningModal(true);
      return;
    }

    // Check stock availability
    for (let p of validStocks) {
      const stock = Stocks.find(s => s._id === p.productId);
      if (!stock) {
        alert(`Stock not found for ${p.name}`);
        return;
      }
      if (p.quantity > stock.quantity) {
        alert(`Insufficient stock for ${p.name}. Available: ${stock.quantity}`);
        return;
      }
    }

    // Prepare stocks to save
    const StocksToSave = validStocks.map(p => {
      const stock = Stocks.find(s => s._id === p.productId);
      return {
        Barcode: p.barcode,
        productId: stock?._id || p.productId,
        name: p.name,
        Brand: stock?.Brand || "",
        quantity: Number(p.quantity),
        Unit: p.unit,
        price: Number(p.price),
        cost: Number(p.cost),
        profit: (Number(p.price) - Number(p.cost)) * Number(p.quantity)
      };
    });

    const billData = {
      InvoiceNumber,
      date,
      CustomerName,
      CustomerNumber,
      Stocks: StocksToSave,
      Subtotal: SubTotal,
      Tax,
      Discount,
      TotalAmount,
      Profit,
      PaymentMethod
    };

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/createinvoice`, billData);

      setShowModal(false);
      setShowSuccessModal(true);

      // Reset form
      setCustomerName("");
      setCustomerNumber("");
      setCustomerId("");
      setSelectedStocks([{ productId: "", barcode: "", name: "", unit: "", quantity: 1, price: 0, cost: 0, discount: 0, total: 0, profit: 0 }]);
      setSubTotal(0);
      setTax(0);
      setDiscount(0);
      setTotalAmount(0);
      setProfit(0);
      setInvoiceNumber(`INV-${Math.floor(Math.random() * 100000)}`);

      handlePrint(billData);
    } catch (error) {
      console.error("Billing Error:", error.response?.data || error);
      alert(error.response?.data?.message || "Failed to save billing");
    }
  };



  const inputStyle = {
    border: "none",
    borderRadius: "10px",
    padding: "12px",
    color: "#fff",
    background: "#3a3a3a",
    boxShadow: "inset 3px 3px 6px rgba(0,0,0,0.6), inset -3px -3px 6px rgba(255,255,255,0.05)",
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
          Billingsss
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
              <Form.Control type="date" value={date} onChange={(e) => setdate(e.target.value)} style={inputStyle} />
            </Form.Group>
          </div>

          {/* Customer Info */}
          {/* Customer Info */}
          <div style={{ display: "flex", gap: "20px" }}>
            <Form.Group style={{ width: "50%" }} className="mb-4">
              <Form.Label>Customer Name</Form.Label>
              <Form.Select
                value={CustomerId}
                onChange={(e) => {
                  const id = e.target.value;
                  setCustomerId(id);

                  // find the selected customer
                  const selectedCustomer = FetchedCustomer.find(c => c._id === id);

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
                <option value="" disabled>Select a Customer</option>
                {FetchedCustomer.map(cust => (
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
                onChange={(e) => setCustomerNumber(e.target.value)} // keep editable
                style={inputStyle}
              />
            </Form.Group>

          </div>


          {/* Product Table */}
          <div className="product-table-wrapper" >
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
                {SelectedStocks.map((item, index) => {

                  return (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>
                        <div
                          style={{
                            position: "relative",
                            width: "180px",
                          }}
                        >
                          <Form.Control
                            type="text"
                            value={item.barcode}
                            onChange={(e) => handleBarcodeChange(index, e.target.value)}
                            placeholder="Enter Barcode"
                            style={{
                              ...inputStyle,
                              paddingRight: "42px", // space for icon
                              height: "47px", width: "100%",
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
                            const selected = Stocks.find(p => p._id === selectedOption.value);
                            if (selected) selectProduct(index, selected);
                          }}
                          options={Stocks.map(p => ({
                            value: p._id,
                            label: `${p.name} (${p.Brand || "No Brand"})`,
                          }))}
                          placeholder="Search or Select Product..."
                          isSearchable={true}
                          menuPortalTarget={document.body}   // ✅ KEY FIX
                          menuPosition="fixed"
                          filterOption={(option, inputValue) => {
                            const search = inputValue.toLowerCase();
                            const [name, barcode] = option.label.toLowerCase().split("(");
                            return (
                              name.includes(search)
                            );
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
                              boxShadow: "inset 3px 3px 6px rgba(0,0,0,0.6), inset -3px -3px 6px rgba(255,255,255,0.05)",
                            }),
                            input: (base) => ({
                              ...base,
                              color: "#fff",
                            }),
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
                  );
                })}
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
                <option>Credit</option>
              </Form.Select>
            </Form.Group>
          </div>

          <div style={{ display: "flex", justifyContent: "center", marginTop: "30px" }}>
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
              Save & Print
            </Button>
          </div>
        </Form>

        {/* Confirm Save */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Body style={{
            background: "#272727ff",
            color: "white",
            textAlign: "center"
          }}>
            <h5 style={{ padding: "10px" }}>Confirm </h5>
            <p style={{ padding: "20px" }}>Do you want to save this invoice?</p>

            <Button style={{ marginRight: "10px" }} variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              Yes, Save
            </Button>
          </Modal.Body>

        </Modal>

        <Modal show={showScanner} onHide={stopScanner} centered size="lg">
          <Modal.Body
            style={{
              background: "#111",
              color: "#fff",
              textAlign: "center",
            }}
          >
            <h5>Scan Barcode</h5>

            <div
              id="barcode-scanner"
              style={{
                width: "100%",
                minHeight: "300px",
                marginTop: "15px",
              }}
            />

            <Button
              variant="danger"
              style={{ marginTop: "15px" }}
              onClick={stopScanner}
            >
              Cancel
            </Button>
          </Modal.Body>
        </Modal>


        {/* Warning */}
        <Modal show={showWarningModal} onHide={() => setShowWarningModal(false)} centered>
          <Modal.Body style={{
            background: "#272727ff",
            color: "white",
            textAlign: "center"
          }}>
            <h5 style={{ padding: "10px" }}>Warning </h5>
            <p style={{ padding: "15px" }}>Please fill all fields and add at least one product.</p>
            <Button style={{ padding: "6px 30px" }} variant="danger" onClick={() => setShowWarningModal(false)}>
              OK
            </Button>
          </Modal.Body>

        </Modal>

        {/* Success */}
        <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)} centered>
          <Modal.Body style={{
            background: "#272727ff",
            color: "white",
            textAlign: "center"
          }}>
            <h5 style={{ padding: "10px" }}>Success</h5>
            <p style={{ padding: "15px" }}> Invoice saved and printed successfully!</p>
            <Button variant="success" onClick={() => setShowSuccessModal(false)}>
              OK
            </Button>
          </Modal.Body>
        </Modal>
      </Card>
    </div>
  );
};

export default Billing;
