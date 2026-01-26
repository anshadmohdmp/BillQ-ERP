import React, { useEffect, useState } from "react";
import { Button, Form, Card, Table, Modal } from "react-bootstrap";
import axios from "axios";
import { MdOutlineEdit, MdDeleteOutline } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import "../src/Css/Units.css"

const Unit = () => {
  const [UnitName, setUnitName] = useState("");
  const [FetchedUnits, setFetchedUnits] = useState([]);
  const [error, setError] = useState("");

  const [showEditConfirm, setShowEditConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false); // ✅ new state
  const [selectedUnitId, setSelectedUnitId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchUnits();
  }, []);

  const fetchUnits = async () => {
    try {
      const response = await axios.get(`https://billq-erp.onrender.com/units`);
      setFetchedUnits(response.data);
    } catch (error) {
      console.error("Error fetching unit data:", error);
    }
  };

  const SubmitData = async (e) => {
    e.preventDefault();
    if (!UnitName) {
      setError("Please fill all fields before submitting.");
      return;
    }
    setError("");
    try {
      const response = await axios.post("https://billq-erp.onrender.com/createunit", { UnitName });
      setUnitName("");
      setFetchedUnits([...FetchedUnits, response.data]);
      setShowSuccessModal(true); // ✅ show success modal
    } catch (error) {
      console.error("❌ There was an error!", error);
      setError("An error occurred while adding the Unit.");
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
  const confirmEditUnit = (id) => {
    setSelectedUnitId(id);
    setShowEditConfirm(true);
  };

  const handleEdit = () => {
    setShowEditConfirm(false);
    navigate(`/editunit/${selectedUnitId}`);
  };

  // Delete
  const confirmDeleteUnit = (id) => {
    setSelectedUnitId(id);
    setShowDeleteConfirm(true);
  };

  const handleDelete = async () => {
    setShowDeleteConfirm(false);
    try {
      await axios.delete(`https://billq-erp.onrender.com/units/${selectedUnitId}`);
      setFetchedUnits(FetchedUnits.filter((unit) => unit._id !== selectedUnitId));
    } catch (error) {
      console.error("❌ There was an error!", error);
      alert("An error occurred while deleting the Unit.");
    }
  };

  return (
    <div
      className="units"
    >
      {/* Add Unit Card */}
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
          Add Unit
        </h2>

        <Form onSubmit={SubmitData}>
          <Form.Group className="mb-4">
            <Form.Label style={{ fontWeight: "500", color: "#bdbdbd" }}>Unit Name</Form.Label>
            <Form.Control
              onChange={(e) => setUnitName(e.target.value)}
              type="text"
              placeholder="Enter Unit Name"
              value={UnitName}
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

      {/* Units Table */}
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
          Units
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
                <th style={{ width: "600px" }}>Units</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {FetchedUnits.length > 0 ? (
                FetchedUnits.map((unit, index) => (
                  <tr key={unit._id}>
                    <td>{index + 1}</td>
                    <td>{unit.UnitName}</td>
                    <td style={{ textAlign: "center" }}>
                      <MdOutlineEdit
                        onClick={() => confirmEditUnit(unit._id)}
                        style={{ marginRight: "10px", cursor: "pointer" }}
                      />
                      <MdDeleteOutline
                        onClick={() => confirmDeleteUnit(unit._id)}
                        style={{ cursor: "pointer" }}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} style={{ textAlign: "center", color: "#ffffffff" }}>
                    No Units found
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
          <p style={{ color: "#ccc" }}>Are you sure you want to edit this unit?</p>
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
          <p style={{ color: "#ccc" }}>Are you sure you want to delete this unit?</p>
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
          <h4 style={{ color: "#ffffffff", marginBottom: "10px" }}> Unit Added Successfully</h4>
          <p style={{ color: "#ccc" }}>Your new unit has been saved successfully.</p>
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

          table {
            font-size: 14px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Unit;
