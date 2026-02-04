import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Card, Form, Button } from "react-bootstrap";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Please fill all fields");
      return;
    }

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/login`, {
        username,
        password,
      });

      // Save JWT token to localStorage
      localStorage.setItem("token", res.data.token);

      // Redirect to dashboard
      navigate("/home");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <Card style={{ width: "400px", padding: "30px", background: "#2a2a2a", color: "#fff" }}>
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Login</h2>
        <Form onSubmit={handleLogin}>
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

          <Button type="submit" className="w-100" style={{ background: "#1a37aa", border: "none" }}>
            Login
          </Button>
        </Form>
        <p style={{ marginTop: "15px", textAlign: "center" }}>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </Card>
    </div>
  );
};

export default Login;
