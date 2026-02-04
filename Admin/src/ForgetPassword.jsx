import React, { useState } from "react";
import axios from "axios";
import { Card, Form, Button } from "react-bootstrap";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!email) {
      setError("Please enter your email");
      return;
    }

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/forgot-password`, { email });
      setMessage(res.data.message);
      setEmail("");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <Card style={{ width: "400px", padding: "30px", background: "#2a2a2a", color: "#fff" }}>
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Forgot Password</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your registered email"
            />
          </Form.Group>

          {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
          {message && <p style={{ color: "green", textAlign: "center" }}>{message}</p>}

          <Button type="submit" className="w-100" style={{ background: "#1a37aa", border: "none" }}>
            Send Reset Link
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default ForgotPassword;
