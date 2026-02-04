import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Card, Form, Button } from "react-bootstrap";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!username || !password) {
      setError("Please fill all fields");
      return;
    }

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/register`, {
        username,
        password,
      });

      setSuccess("User registered successfully! Redirecting to login...");
      setUsername("");
      setPassword("");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <Card style={{ width: "400px", padding: "30px", background: "#2a2a2a", color: "#fff" }}>
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Register</h2>
        <Form onSubmit={handleRegister}>
          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
            />
          </Form.Group>

          {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
          {success && <p style={{ color: "green", textAlign: "center" }}>{success}</p>}

          <Button type="submit" className="w-100" style={{ background: "#1a37aa", border: "none" }}>
            Register
          </Button>
        </Form>
        <p style={{ marginTop: "15px", textAlign: "center" }}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </Card>
    </div>
  );
};

export default Register;
