import axios from "axios";
import React, { useEffect, useState } from "react";
import { Table, Card, Button, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { MdOutlineEdit, MdDeleteOutline } from "react-icons/md";
import "../src/Css/Suppliers.css";

const Suppliers = () => {
  const [Suppliers, setSuppliers] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditConfirm, setShowEditConfirm] = useState(false);
  const [selectedSupplierId, setSelectedSupplierId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/suppliers`);
      setSuppliers(response.data);
    } catch (error) {
      console.error("Error fetching Suppliers:", error);
    }
  };

  const handleEditConfirm = (id) => {
    setSelectedSupplierId(id);
    setShowEditConfirm(true);
  };

  const handleEdit = () => {
    setShowEditConfirm(false);
    navigate(`/editsuppliers/${selectedSupplierId}`);
  };

  const handleDeleteConfirm = (id) => {
    setSelectedSupplierId(id);
    setShowDeleteConfirm(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/suppliers/${selectedSupplierId}`);
      setSuppliers(Suppliers.filter((s) => s._id !== selectedSupplierId));
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error("Error deleting supplier:", error);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div
      className="suppliers"
    >
      {/* Edit Confirmation Modal */}
      <Modal
        show={showEditConfirm}
        onHide={() => setShowEditConfirm(false)}
        centered
      >
        <Modal.Body
          style={{
            background: "#272727ff",
            color: "white",
            textAlign: "center",
            padding: "25px",
          }}
        >
          <h4>⚠️ Confirm Edit</h4>
          <p style={{ color: "#ccc" }}>Are you sure you want to edit this supplier?</p>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "20px",
              marginTop: "15px",
            }}
          >
            <Button
              variant="secondary"
              onClick={() => setShowEditConfirm(false)}
              style={{
                background: "#555",
                border: "none",
                borderRadius: "10px",
                padding: "8px 25px",
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleEdit}
              style={{
                background: "#2196f3",
                border: "none",
                borderRadius: "10px",
                padding: "8px 25px",
              }}
            >
              Edit
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        show={showDeleteConfirm}
        onHide={() => setShowDeleteConfirm(false)}
        centered
      >
        <Modal.Body
          style={{
            background: "#272727ff",
            color: "white",
            textAlign: "center",
            padding: "25px",
          }}
        >
          <h4>⚠️ Confirm Delete</h4>
          <p style={{ color: "#ccc" }}>Are you sure you want to delete this supplier?</p>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "20px",
              marginTop: "15px",
            }}
          >
            <Button
              variant="secondary"
              onClick={() => setShowDeleteConfirm(false)}
              style={{
                background: "#555",
                border: "none",
                borderRadius: "10px",
                padding: "8px 25px",
              }}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              style={{
                background: "#d9534f",
                border: "none",
                borderRadius: "10px",
                padding: "8px 25px",
              }}
            >
              Delete
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      {/* Main Card */}
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
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h2
            style={{
              color: "#e6e6e6",
              textShadow: "0 0 6px rgba(255,255,255,0.1)",
            }}
          >
            Suppliers
          </h2>

          <Button
          className="submit-button"
            onClick={() => navigate("/addsuppliers")}
            style={{
              border: "none",
              padding: "10px 20px",
              borderRadius: "12px",
              background: "linear-gradient(145deg, #3a3a3a, #1e1e1e)",
              fontWeight: "600",
              boxShadow:
                "4px 4px 8px rgba(0,0,0,0.8), -3px -3px 6px rgba(255,255,255,0.05)",
              transition: "0.3s",
            }}
          > 
            Add supplier
          </Button>
        </div>

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
                <th>#</th>
                <th>Supplier Name</th>
                <th>Contact Person</th>
                <th>Contact Number</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {Suppliers.length > 0 ? (
                Suppliers.map((supplier, index) => (
                  <tr key={supplier._id}>
                    <td>{index + 1}</td>
                    <td>{supplier.SupplierName}</td>
                    <td>{supplier.ContactPerson}</td>
                    <td>{supplier.ContactNumber}</td>
                    <td style={{ textAlign: "center" }}>
                      <MdOutlineEdit
                        onClick={() => handleEditConfirm(supplier._id)}
                        style={{ marginRight: "10px", cursor: "pointer" }}
                      />
                      <MdDeleteOutline
                        onClick={() => handleDeleteConfirm(supplier._id)}
                        style={{ cursor: "pointer", color: "#ff5555" }}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center" }}>
                    No suppliers found
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

export default Suppliers;
