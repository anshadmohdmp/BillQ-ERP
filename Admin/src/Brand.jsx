import React, { useEffect, useState } from "react";
import { Button, Form, Card, Table, Modal } from "react-bootstrap";
import axios from "axios";
import { MdOutlineEdit, MdDeleteOutline } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import "./Css/Brand.css"
import { useAuth } from "./AuthProvider";


const Brand = () => {
  const [Brand, setBrand] = useState("");
  const [FetchedBrands, setFetchedBrands] = useState([]);
  const [error, setError] = useState("");

  const [showEditConfirm, setShowEditConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false); // ✅ new state
  const [selectedBrandId, setSelectedBrandId] = useState(null);

  const navigate = useNavigate();
  const { user } = useAuth(); 

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/brands`,{
    headers: {
      Authorization: `Bearer ${user.token}`, // ✅ pass token from context
    },
  });
      setFetchedBrands(response.data);
    } catch (error) {
      console.error("Error fetching Brand data:", error);
    }
  };

  const SubmitData = async (e) => {
    e.preventDefault();
    if (!Brand) {
      setError("Please fill all fields before submitting.");
      return;
    }
    setError("");
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/createbrand`, { Brand },{
    headers: {
      Authorization: `Bearer ${user.token}`, // ✅ pass token from context
    },
  });
      setBrand("");
      setFetchedBrands([...FetchedBrands, response.data]);
      setShowSuccessModal(true); // ✅ show success modal
    } catch (error) {
      console.error("❌ There was an error!", error);
      setError("An error occurred while adding the Brand.");
    }
  };

  const inputStyle = {
    border: "none",
    borderRadius: "10px",
    color: "white",
    padding: "12px",
    background: "#3a3a3a",
    boxShadow: "inset 3px 3px 6px rgba(0,0,0,0.6), inset -3px -3px 6px rgba(255,255,255,0.05)",
  };

  // Edit
  const confirmEditBrand = (id) => {
    setSelectedBrandId(id);
    setShowEditConfirm(true);
  };

  const handleEdit = () => {
    setShowEditConfirm(false);
    navigate(`/editBrand/${selectedBrandId}`);
  };

  // Delete
  const confirmDeleteBrand = (id) => {
    setSelectedBrandId(id);
    setShowDeleteConfirm(true);
  };

  const handleDelete = async () => {
    setShowDeleteConfirm(false);
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/brands/${selectedBrandId}`,{
    headers: {
      Authorization: `Bearer ${user.token}`, // ✅ pass token from context
    },
  });
      setFetchedBrands(FetchedBrands.filter((Brand) => Brand._id !== selectedBrandId));
    } catch (error) {
      console.error("❌ There was an error!", error);
      alert("An error occurred while deleting the Brand.");
    }
  };

  return (
    <div
      className="brands"
    >
      {/* Add Brand Card */}
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
          Add Brand
        </h2>

        <Form onSubmit={SubmitData}>
          <Form.Group className="mb-4">
            <Form.Label style={{ fontWeight: "500", color: "#bdbdbd" }}>Brand Name</Form.Label>
            <Form.Control
              onChange={(e) => setBrand(e.target.value)}
              type="text"
              placeholder="Enter Brand Name"
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
                boxShadow: "4px 4px 8px rgba(0,0,0,0.8), -3px -3px 6px rgba(255,255,255,0.05)",
                transition: "0.3s",
              }}
            >
              Submit
            </Button>
          </div>
        </Form>
      </Card>

      {/* Brands Table */}
      <Card
        className="responsive-card"
        style={{
          width: "100%",
          maxWidth: "1100px",
          background: "#2a2a2a",
          borderRadius: "20px",
          padding: "20px",
          boxShadow: "8px 8px 16px rgba(0,0,0,0.7), -8px -8px 16px rgba(255,255,255,0.05)",
          color: "#fff",
          margin: "20px auto",
          overflowX: "auto",
        }}
      >
        <h2 style={{ color: "#e6e6e6", textShadow: "0 0 6px rgba(255,255,255,0.1)", marginBottom: "20px" }}>
          Brands
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
              boxShadow: "inset 3px 3px 6px rgba(0,0,0,0.6), inset -3px -3px 6px rgba(255,255,255,0.05)",
              tableLayout: "auto",
              whiteSpace: "nowrap",
            }}
          >
            <thead>
              <tr>
                <th>#</th>
                <th style={{ width: "600px" }}>Brands</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {FetchedBrands.length > 0 ? (
                FetchedBrands.map((Brand, index) => (
                  <tr key={Brand._id}>
                    <td>{index + 1}</td>
                    <td>{Brand.Brand}</td>
                    <td style={{ textAlign: "center" }}>
                      <MdOutlineEdit
                        onClick={() => confirmEditBrand(Brand._id)}
                        style={{ marginRight: "10px", cursor: "pointer" }}
                      />
                      <MdDeleteOutline
                        onClick={() => confirmDeleteBrand(Brand._id)}
                        style={{ cursor: "pointer" }}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} style={{ textAlign: "center", color: "#ffffffff" }}>
                    No Brands found
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </Card>

      {/* ✏️ Edit Confirmation Modal */}
      <Modal show={showEditConfirm} onHide={() => setShowEditConfirm(false)} centered>
        <Modal.Body
          style={{
            background: "#272727",
            color: "white",
            textAlign: "center",
            padding: "25px",
          }}
        >
          <h4>⚠️ Confirm Edit</h4>
          <p style={{ color: "#ccc" }}>Are you sure you want to edit this Brand?</p>
          <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginTop: "15px" }}>
            <Button
              variant="secondary"
              onClick={() => setShowEditConfirm(false)}
              style={{ background: "#555", border: "none", borderRadius: "10px", padding: "8px 25px" }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleEdit}
              style={{ background: "#2196f3", border: "none", borderRadius: "10px", padding: "8px 25px" }}
            >
              Edit
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      {/* 🗑 Delete Confirmation Modal */}
      <Modal show={showDeleteConfirm} onHide={() => setShowDeleteConfirm(false)} centered>
        <Modal.Body
          style={{
            background: "#272727",
            color: "white",
            textAlign: "center",
            padding: "25px",
          }}
        >
          <h4>⚠️ Confirm Delete</h4>
          <p style={{ color: "#ccc" }}>Are you sure you want to delete this Brand?</p>
          <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginTop: "15px" }}>
            <Button
              variant="secondary"
              onClick={() => setShowDeleteConfirm(false)}
              style={{ background: "#555", border: "none", borderRadius: "10px", padding: "8px 25px" }}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              style={{ background: "#ff5555", border: "none", borderRadius: "10px", padding: "8px 25px" }}
            >
              Delete
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      {/* ✅ Success Modal */}
      <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)} centered>
        <Modal.Body
          style={{
            background: "#1e1e1e",
            color: "white",
            textAlign: "center",
            padding: "30px",
          }}
        >
          <h4 style={{ color: "#ffffffff", marginBottom: "10px" }}> Brand Added Successfully</h4>
          <p style={{ color: "#ccc" }}>Your new Brand has been saved successfully.</p>
          <Button
            onClick={() => setShowSuccessModal(false)}
            style={{
              background: "#1a37aaff",
              border: "none",
              borderRadius: "10px",
              padding: "8px 25px",
              marginTop: "15px",
            }}
          >
            OK
          </Button>
        </Modal.Body>
      </Modal>
      
    </div>
  );
};

export default Brand;