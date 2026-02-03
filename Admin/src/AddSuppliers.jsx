import React, { useState } from "react";
import { Button, Form, Card, Modal } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddSuppliers = () => {
  const [SupplierName, setSupplierName] = useState("");
  const [ContactPerson, setContactPerson] = useState("");
  const [ContactNumber, setContactNumber] = useState("");
  const [error, setError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const navigate = useNavigate();

  const SubmitData = async (e) => {
    e.preventDefault();

    if (!SupplierName || !ContactPerson || !ContactNumber) {
      setError("Please fill all fields before submitting.");
      return;
    }

    setError("");

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/createsupplier`, {
        SupplierName,
        ContactPerson,
        ContactNumber,
      });

      console.log("Supplier added successfully:", response.data);

      // Show success modal
      setShowSuccessModal(true);

      // Clear fields
      setSupplierName("");
      setContactPerson("");
      setContactNumber("");

      // Redirect after 2 seconds
      setTimeout(() => {
        setShowSuccessModal(false);
        navigate("/suppliers");
      }, 2000);
    } catch (error) {
      console.error("❌ There was an error!", error);
      setError("An error occurred while adding the supplier.");
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

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#3e3e3e",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "60px 0",
        overflowY: "auto",
      }}
    >
      <Card
        style={{
          width: "900px",
          padding: "40px",
          borderRadius: "20px",
          background: "#2a2a2a",
          boxShadow:
            "8px 8px 16px rgba(0,0,0,0.7), -4px -4px 12px rgba(255,255,255,0.05)",
          color: "#fff",
          margin: "40px 0",
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
          Add Supplier
        </h2>

        <Form className="add-product-form" onSubmit={SubmitData}>
          <Form.Group className="mb-4">
            <Form.Label style={{ fontWeight: "500", color: "#bdbdbd" }}>
              Supplier Name
            </Form.Label>
            <Form.Control
              onChange={(e) => setSupplierName(e.target.value)}
              type="text"
              placeholder="Enter Supplier Name"
              value={SupplierName}
              style={inputStyle}
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label style={{ fontWeight: "500", color: "#bdbdbd" }}>
              Contact Person
            </Form.Label>
            <Form.Control
              onChange={(e) => setContactPerson(e.target.value)}
              type="text"
              placeholder="Enter Contact Person"
              value={ContactPerson}
              style={inputStyle}
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label style={{ fontWeight: "500", color: "#bdbdbd" }}>
              Contact Number
            </Form.Label>
            <Form.Control
              onChange={(e) => setContactNumber(e.target.value)}
              type="number"
              placeholder="Enter Contact Number"
              value={ContactNumber}
              style={inputStyle}
            />
          </Form.Group>

          {error && (
            <p
              style={{
                color: "#ff5555",
                textAlign: "center",
                fontWeight: "500",
                marginBottom: "20px",
              }}
            >
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
                                        boxShadow:
                                          "4px 4px 8px rgba(0,0,0,0.8), -3px -3px 6px rgba(255,255,255,0.05)",
                                        transition: "0.3s",
                                      }}
                                    >
              Submit
            </Button>
          </div>
        </Form>
      </Card>

      {/* ✅ Success Modal */}
      <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)} centered>
  <Modal.Header
    closeButton
    style={{
      backgroundColor: "#1e1e1e",
      borderBottom: "1px solid #333",
    }}
  >
    <Modal.Title style={{ color: "#fcfffcff" }}>Success</Modal.Title>
  </Modal.Header>

  <Modal.Body
    style={{
      backgroundColor: "#1e1e1e",
      color: "#e0e0e0",
      textAlign: "center",
      fontSize: "16px",
      padding: "25px",
    }}
  >
    Supplier added successfully!
  </Modal.Body>

  <Modal.Footer
    style={{
      backgroundColor: "#1e1e1e",
      borderTop: "1px solid #333",
      justifyContent: "center",
    }}
  >
    <Button
      variant="success"
      onClick={() => navigate("/suppliers")}
      style={{
        background: "#2102d0ff",
        border: "none",
        borderRadius: "10px",
        padding: "8px 25px",
        fontWeight: "500",
      }}
    >
      OK
    </Button>
  </Modal.Footer>
</Modal>

    </div>
  );
};

export default AddSuppliers;
