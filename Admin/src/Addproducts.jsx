import React, { useEffect, useState } from "react";
import { Button, Form, Card, Modal } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Css/AddProducts.css";
import { Html5Qrcode } from "html5-qrcode";


const Addproducts = () => {
  const [Barcode, setBarcode] = useState("");
  const [ProductName, setProductName] = useState("");
  const [Category, setCategory] = useState("");
  const [ItemCategory, setItemCategory] = useState("");
  const [Unit, setUnit] = useState("");
  const [Brand, setBrand] = useState("");
  const [error, setError] = useState("");
  const [fetchedCategory, setFetchedCategory] = useState([]);
  const [fetchedUnit, setFetchedUnit] = useState([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
const html5QrCodeRef = React.useRef(null);

  const navigate = useNavigate();

  // ✅ Fetch Categories
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/categories`)
      .then((response) => setFetchedCategory(response.data))
      .catch((error) => console.error("Error fetching categories:", error));
  }, []);

  // ✅ Fetch Units
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/units`)
      .then((response) => setFetchedUnit(response.data))
      .catch((error) => console.error("Error fetching units:", error));
  }, []);

  // ✅ Clear input fields
  const clearForm = () => {
    setBarcode("");
    setProductName("");
    setUnit("");
    setCategory("");
    setItemCategory("");
    setBrand("");
  };

  // ✅ Submit Product
  const SubmitData = async (e) => {
    e.preventDefault();

    if (!Barcode || !ProductName || !Unit || !Category ) {
      setError("Please fill all fields before submitting.");
      return;
    }

    setError("");

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/createproduct`, {
        Barcode,
        ProductName,
        Unit,
        Category,
        ItemCategory,
        Brand,
      });

      // ✅ Show modal instead of alert
      setShowSuccessModal(true);
    } catch (error) {
      console.error("❌ There was an error!", error);
      setError("An error occurred while adding the product.");
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

  const startBarcodeScanner = () => {
  setShowScanner(true);

  setTimeout(() => {
    const scanner = new Html5Qrcode("barcode-reader");
    html5QrCodeRef.current = scanner;

    scanner.start(
      { facingMode: "environment" }, // back camera
      {
        fps: 10,
        qrbox: { width: 280, height: 120 },
      },
      (decodedText) => {
        setBarcode(decodedText); // ✅ AUTO-FILL BARCODE

        scanner.stop().then(() => {
          scanner.clear();
          setShowScanner(false);
        });
      },
      () => {}
    );
  }, 300);
};

const stopBarcodeScanner = () => {
  if (html5QrCodeRef.current) {
    html5QrCodeRef.current.stop().then(() => {
      html5QrCodeRef.current.clear();
      setShowScanner(false);
    });
  }
};


  return (
    <div
      className="Add-products"
    >
      <Card
        className="card"
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
          Add Product
        </h2>

        <Form className="add-product-form" onSubmit={SubmitData}>
          <div style={{ display: "flex", gap: "20px" }}>
            <Form.Group className="mb-4" style={{ position: "relative" }}>
  <Form.Label style={{ fontWeight: "500", color: "#bdbdbd" }}>
    Barcode
  </Form.Label>

  <div style={{ position: "relative" }}>
    <Form.Control
      onChange={(e) => setBarcode(e.target.value)}
      type="text"
      placeholder="Enter Barcode"
      value={Barcode}
      style={{
        ...inputStyle,
        paddingRight: "45px", // 🔑 space for icon
      }}
    />

    <Button
      variant="link"
      onClick={startBarcodeScanner}
      style={{
        position: "absolute",
        right: "8px",
        top: "50%",
        transform: "translateY(-50%)",
        padding: "0",
        fontSize: "16px",
        color: "#bbb",
        textDecoration: "none",
      }}
    >
      📷
    </Button>
  </div>
</Form.Group>

            <Form.Group style={{ width: "100%" }} className="mb-4">
              <Form.Label style={{ fontWeight: "500", color: "#bdbdbd" }}>Product Name</Form.Label>
              <Form.Control
                onChange={(e) => setProductName(e.target.value)}
                type="text"
                placeholder="Enter Product Name"
                value={ProductName}
                style={inputStyle}
              />
            </Form.Group>
          </div>

          <div style={{ display: "flex", gap: "20px" }}>

            <Form.Group style={{ width: "50%" }} className="mb-4">
              <Form.Label style={{ fontWeight: "500", color: "#bdbdbd" }}>Unit</Form.Label>
              <Form.Select
                className="custom-select"
                value={Unit || ""}
                onChange={(e) => setUnit(e.target.value)}
              >
                <option value="" disabled>Select a Unit</option>
                {fetchedUnit.map((unit) => (
                  <option key={unit._id} value={unit.UnitName}>{unit.UnitName}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group style={{ width: "50%" }} className="mb-4">
              <Form.Label style={{ fontWeight: "500", color: "#bdbdbd" }}>Category</Form.Label>
              <Form.Select
                className="custom-select"
                value={Category || ""}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="" disabled>Select a Category</option>
                {fetchedCategory.map((cat) => (
                  <option key={cat._id} value={cat.CategoryName}>{cat.CategoryName}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </div>

          <div style={{ display: "flex", gap: "20px" }}>
            <Form.Group style={{ width: "50%" }} className="mb-4">
              <Form.Label style={{ fontWeight: "500", color: "#bdbdbd" }}>Item Category</Form.Label>
              <Form.Control
                onChange={(e) => setItemCategory(e.target.value)}
                type="text"
                placeholder="Item Category"
                value={ItemCategory}
                style={inputStyle}
              />
            </Form.Group>

            <Form.Group style={{ width: "50%" }} className="mb-4">
              <Form.Label style={{ fontWeight: "500", color: "#bdbdbd" }}>Brand</Form.Label>
              <Form.Control
                onChange={(e) => setBrand(e.target.value)}
                type="text"
                placeholder="Brand"
                value={Brand}
                style={inputStyle}
              />
            </Form.Group>
          </div>


          {error && (
            <p style={{ color: "#ff5555", textAlign: "center", fontWeight: "500", marginBottom: "20px" }}>
              {error}
            </p>
          )}

          <div style={{ textAlign: "center" }}>
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
              Submit
            </Button>
          </div>
        </Form>
      </Card>

      {/* ✅ Success Modal */}
     <Modal
  show={showSuccessModal}
  onHide={() => setShowSuccessModal(false)}
  centered
  backdrop="static"
>

  <Modal.Body
  closeButton onClick={() => {
        clearForm();
        setShowSuccessModal(false);
      }}
    style={{
      background: "#272727ff",
      color: "white",
      textAlign: "center",
      fontSize: "16px",
    }}
  >
    <h5 style={{padding:"20px"}}>Product Added Successfully</h5>
    <p style={{marginBottom:"30px"}}>What would you like to do next?</p>
    <Button
      variant="primary"
      onClick={() => navigate("/products")}
      style={{ padding: "6px 10px",marginRight:"20px" }}
    >
      View Products
    </Button>
    <Button
      variant="secondary"
      onClick={() => {
        clearForm();
        setShowSuccessModal(false);
      }}
      style={{ padding: "6px 10px" }}
    >
      Continue Adding
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
      id="barcode-reader"
      style={{
        width: "100%",
        minHeight: "300px",
        marginTop: "15px",
      }}
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


    </div>
  );
};

export default Addproducts;
