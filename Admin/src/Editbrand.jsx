import React, { useEffect, useState } from "react";
import { Button, Form, Card, Modal } from "react-bootstrap";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "../src/Css/Suppliers.css";
import { useAuth } from "./AuthProvider";


const Editbrand = () => {
  const [Brand, setBrand] = useState("");
  const [error, setError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const Navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth(); 

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/brands/${id}`,{
    headers: {
      Authorization: `Bearer ${user.token}`, // ✅ pass token from context
    },
  })
      .then((response) => {
        setBrand(response.data.Brand);
      })
      .catch((error) => console.error("Error fetching brand data:", error));
  }, [id]);

  const SubmitData = async (e) => {
    e.preventDefault();
    if (!Brand) {
      setError("Please fill all fields before submitting.");
      return;
    }
    setError("");
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/brands/${id}`, { Brand },{
    headers: {
      Authorization: `Bearer ${user.token}`, // ✅ pass token from context
    },
  });
      setShowSuccessModal(true); // show success modal
    } catch (error) {
      console.error("❌ There was an error!", error);
      setError("An error occurred while updating the brand.");
    }
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    Navigate("/brand"); // redirect to brands page
  };

  const inputStyle = {
    border: "none",
    borderRadius: "10px",
    color: "white",
    padding: "12px",
    background: "#3a3a3a",
    boxShadow: "inset 3px 3px 6px rgba(0,0,0,0.6), inset -3px -3px 6px rgba(255,255,255,0.05)",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#3e3e3e",
        padding: "20px",
      }}
    >
      <Card
        className="responsive-card"
        style={{
          width: "100%",
          maxWidth: "1100px",
          padding: "40px",
          borderRadius: "20px",
          background: "#2a2a2a",
          boxShadow: "8px 8px 16px rgba(0,0,0,0.7), -4px -4px 12px rgba(255,255,255,0.05)",
          color: "#fff",
          margin: "20px auto",
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
          Edit brand
        </h2>

        <Form onSubmit={SubmitData}>
          <Form.Group className="mb-4">
            <Form.Label style={{ fontWeight: "500", color: "#bdbdbd" }}>brand Name</Form.Label>
            <Form.Control
              onChange={(e) => setBrand(e.target.value)}
              type="text"
              placeholder="Enter brand Name"
              value={Brand}
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
          style={{
            background: "#272727ff",
            color: "white",
            textAlign: "center",
            padding: "25px",
          }}
        >
          <h4>✅ brand Updated Successfully</h4>
          <div style={{ marginTop: "20px" }}>
            <Button
              variant="primary"
              onClick={handleCloseModal}
              style={{ background: "#2196f3", border: "none", borderRadius: "10px", padding: "8px 25px" }}
            >
              Ok
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      {/* Responsive CSS */}
      <style jsx="true">{`
        @media (max-width: 768px) {
          .responsive-card {
            padding: 20px !important;
            margin-left: 10px !important;
            margin-right: 10px !important;
          }

          input,
          select,
          button {
            width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Editbrand;
