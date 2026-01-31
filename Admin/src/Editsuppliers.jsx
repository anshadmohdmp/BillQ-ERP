import React, { useEffect, useState } from "react";
import { Button, Form, Card, Modal } from "react-bootstrap";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "../src/Css/Suppliers.css";

const Editsuppliers = () => {
  const [SupplierName, setSupplierName] = useState("");
  const [ContactPerson, setContactPerson] = useState("");
  const [ContactNumber, setContactNumber] = useState("");
  const [error, setError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();

  // Fetch supplier data
  useEffect(() => {
    axios
      .get(`https://billq-erp.onrender.com/suppliers/${id}`)
      .then((response) => {
        const supplier = response.data;
        setSupplierName(supplier.SupplierName);
        setContactPerson(supplier.ContactPerson);
        setContactNumber(supplier.ContactNumber);
      })
      .catch((error) => console.error("Error fetching supplier data:", error));
  }, [id]);

  const SubmitData = async (e) => {
    e.preventDefault();

    if (!SupplierName || !ContactPerson || !ContactNumber) {
      setError("Please fill all fields before submitting.");
      return;
    }

    setError("");

    try {
      await axios.put(`https://billq-erp.onrender.com/suppliers/${id}`, {
        SupplierName,
        ContactPerson,
        ContactNumber,
      });

      // Show success modal instead of alert
      setShowSuccessModal(true);
    } catch (error) {
      console.error("❌ There was an error!", error);
      setError("An error occurred while updating the supplier.");
    }
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    navigate("/suppliers"); // Redirect after closing modal
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
          Edit Supplier
        </h2>

        <Form onSubmit={SubmitData}>
          <Form.Group className="mb-4">
            <Form.Label style={{ fontWeight: "500", color: "#bdbdbd" }}>Supplier Name</Form.Label>
            <Form.Control
              type="text"
              value={SupplierName}
              onChange={(e) => setSupplierName(e.target.value)}
              style={inputStyle}
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label style={{ fontWeight: "500", color: "#bdbdbd" }}>Contact Person</Form.Label>
            <Form.Control
              type="text"
              value={ContactPerson}
              onChange={(e) => setContactPerson(e.target.value)}
              style={inputStyle}
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label style={{ fontWeight: "500", color: "#bdbdbd" }}>Contact Number</Form.Label>
            <Form.Control
              type="number"
              value={ContactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              style={inputStyle}
            />
          </Form.Group>

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

      {/* Success Modal */}
      <Modal show={showSuccessModal} onHide={handleCloseModal} centered>
        <Modal.Body
          style={{ background: "#272727ff", color: "white", textAlign: "center", borderRadius: "10px", padding: "25px" }}
        >
          <h4>✅ Supplier Updated Successfully</h4>
          <div style={{ marginTop: "20px" }}>
            <Button
              variant="primary"
              onClick={handleCloseModal}
              style={{ background: "#2196f3", border: "none", borderRadius: "10px", padding: "8px 25px" }}
            >
              Close
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Editsuppliers;
