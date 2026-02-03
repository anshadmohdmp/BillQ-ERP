import axios from "axios";
import React, { useEffect, useState } from "react";
import { Table, Card, Button, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { MdOutlineEdit, MdDeleteOutline } from "react-icons/md";
import "../src/Css/Customers.css";

const Customers = () => {
  const [Customers, setCustomers] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditConfirm, setShowEditConfirm] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/Customers`);
      setCustomers(response.data);
    } catch (error) {
      console.error("Error fetching Customers:", error);
    }
  };

  const handleEditConfirm = (id) => {
    setSelectedCustomerId(id);
    setShowEditConfirm(true);
  };

  const handleEdit = () => {
    setShowEditConfirm(false);
    navigate(`/editCustomers/${selectedCustomerId}`);
  };

  const handleDeleteConfirm = (id) => {
    setSelectedCustomerId(id);
    setShowDeleteConfirm(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/Customers/${selectedCustomerId}`);
      setCustomers(Customers.filter((s) => s._id !== selectedCustomerId));
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error("Error deleting Customer:", error);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div
      className="customers"
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
          <p style={{ color: "#ccc" }}>Are you sure you want to edit this Customer?</p>
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
          <p style={{ color: "#ccc" }}>Are you sure you want to delete this Customer?</p>
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
            Customers
          </h2>

          <Button
          className="submit-button"
            onClick={() => navigate("/addCustomers")}
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
            Add Customer
          </Button>
        </div>

        <div  style={{ overflowX: "auto" }}>
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
                <th>Customer Name</th>
                <th>Customer Address</th>
                <th>Customer Number</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {Customers.length > 0 ? (
                Customers.map((Customer, index) => (
                  <tr key={Customer._id}>
                    <td>{index + 1}</td>
                    <td>{Customer.CustomerName}</td>
                    <td>{Customer.CustomerAddress}</td>
                    <td>{Customer.CustomerNumber}</td>
                    <td style={{ textAlign: "center" }}>
                      <MdOutlineEdit
                        onClick={() => handleEditConfirm(Customer._id)}
                        style={{ marginRight: "10px", cursor: "pointer" }}
                      />
                      <MdDeleteOutline
                        onClick={() => handleDeleteConfirm(Customer._id)}
                        style={{ cursor: "pointer", color: "#ff5555" }}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center" }}>
                    No Customers found
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

export default Customers;
