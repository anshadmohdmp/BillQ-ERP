import React, { useEffect, useState } from "react";
import { Button, Form, Card, Table, Modal } from "react-bootstrap";
import { MdOutlineEdit, MdDeleteOutline } from "react-icons/md";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddCategory = () => {
  const [CategoryName, setCategoryName] = useState("");
  const [FetchedCategoryName, setFetchedCategoryName] = useState([]);
  const [error, setError] = useState("");

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const [showEditConfirm, setShowEditConfirm] = useState(false);

  const [deleteId, setDeleteId] = useState(null);
  const [editId, setEditId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:3002/categories");
      setFetchedCategoryName(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const SubmitData = async (e) => {
    e.preventDefault();

    if (!CategoryName) {
      setError("Please fill all fields before submitting.");
      return;
    }

    setError("");

    try {
      await axios.post("http://localhost:3002/createcategory", { CategoryName });
      setShowAddModal(true);
      setCategoryName("");
      fetchCategories();
    } catch (error) {
      console.error("❌ Error adding category:", error);
      setError("An error occurred while adding the Category.");
    }
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowDeleteConfirm(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:3002/categories/${deleteId}`);
      setShowDeleteConfirm(false);
      setShowDeleteSuccess(true);
      fetchCategories();
    } catch (error) {
      console.error("❌ Error deleting category:", error);
      setShowDeleteConfirm(false);
      setError("An error occurred while deleting the Category.");
    }
  };

  const confirmEdit = (id) => {
    setEditId(id);
    setShowEditConfirm(true);
  };

  const handleEdit = () => {
    setShowEditConfirm(false);
    navigate(`/editcategory/${editId}`);
  };

  const inputStyle = {
    border: "none",
    borderRadius: "10px",
    color: "white",
    padding: "12px",
    background: "#3a3a3a",
    boxShadow:
      "inset 3px 3px 6px rgba(0,0,0,0.6), inset -3px -3px 6px rgba(255,255,255,0.05)",
  };

  return (
    <div
      style={{
        marginLeft: "250px",
        marginTop: "-160px",
        minHeight: "100vh",
        backgroundColor: "#3e3e3e",
        justifyContent: "center",
        alignItems: "center",
        padding: "60px 0",
        overflowY: "auto",
      }}
    >
      {/* Add Success Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered>
        <Modal.Body
          style={{
            background: "#272727ff",
            color: "white",
            textAlign: "center",
            padding: "25px",
          }}
        >
          <h4>✅ Category Added Successfully!</h4>
          <p style={{ color: "#ccc" }}>Your new category has been saved.</p>
          <Button
            onClick={() => setShowAddModal(false)}
            style={{
              marginTop: "15px",
              border: "none",
              padding: "10px 30px",
              borderRadius: "10px",
              background: "linear-gradient(145deg, #3a3a3a, #1e1e1e)",
              color: "#f2f2f2",
              fontWeight: "600",
            }}
          >
            Continue
          </Button>
        </Modal.Body>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteConfirm} onHide={() => setShowDeleteConfirm(false)} centered>
        <Modal.Body
          style={{
            background: "#272727ff",
            color: "white",
            textAlign: "center",
            padding: "25px",
          }}
        >
          <h4>⚠️ Confirm Delete</h4>
          <p style={{ color: "#ccc" }}>Are you sure you want to delete this category?</p>
          <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginTop: "15px" }}>
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

      {/* Delete Success Modal */}
      <Modal show={showDeleteSuccess} onHide={() => setShowDeleteSuccess(false)} centered>
        <Modal.Body
          style={{
            background: "#272727ff",
            color: "white",
            textAlign: "center",
            padding: "25px",
          }}
        >
          <h4>✅ Category Deleted Successfully!</h4>
          <Button
            onClick={() => setShowDeleteSuccess(false)}
            style={{
              marginTop: "15px",
              border: "none",
              padding: "10px 30px",
              borderRadius: "10px",
              background: "linear-gradient(145deg, #3a3a3a, #1e1e1e)",
              color: "#f2f2f2",
              fontWeight: "600",
            }}
          >
            OK
          </Button>
        </Modal.Body>
      </Modal>

      {/* Edit Confirmation Modal */}
      <Modal show={showEditConfirm} onHide={() => setShowEditConfirm(false)} centered>
        <Modal.Body
          style={{
            background: "#272727ff",
            color: "white",
            textAlign: "center",
            padding: "25px",
          }}
        >
          <h4>⚠️ Confirm Edit</h4>
          <p style={{ color: "#ccc" }}>Are you sure you want to edit this category?</p>
          <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginTop: "15px" }}>
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

      {/* Add Category Card */}
      <Card
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
          Add Category
        </h2>

        <Form onSubmit={SubmitData}>
          <Form.Group className="mb-4">
            <Form.Label style={{ fontWeight: "500", color: "#bdbdbd" }}>
              Category Name
            </Form.Label>
            <Form.Control
              onChange={(e) => setCategoryName(e.target.value)}
              type="text"
              placeholder="Enter Category Name"
              value={CategoryName}
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

      {/* Category Table */}
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
        <h2
          style={{
            color: "#e6e6e6",
            textShadow: "0 0 6px rgba(255,255,255,0.1)",
            marginBottom: "20px",
          }}
        >
          Categories
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
                <th style={{ width: "600px" }}>Category Name</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {FetchedCategoryName.length > 0 ? (
                FetchedCategoryName.map((cat, index) => (
                  <tr key={cat._id}>
                    <td>{index + 1}</td>
                    <td>{cat.CategoryName}</td>
                    <td style={{ textAlign: "center" }}>
                      <MdOutlineEdit
                        onClick={() => confirmEdit(cat._id)}
                        style={{ marginRight: "10px", cursor: "pointer" }}
                      />
                      <MdDeleteOutline
                        onClick={() => confirmDelete(cat._id)}
                        style={{ cursor: "pointer", color: "#ff5555" }}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} style={{ textAlign: "center", color: "#ffffffff" }}>
                    No Categories found
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

export default AddCategory;
