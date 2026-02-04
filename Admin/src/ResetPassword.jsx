import React, { useState } from "react";
import axios from "axios";
import { Card, Form, Button, InputGroup } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const ResetPassword = () => {
  const { token } = useParams(); // get token from URL
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!password || !confirmPassword) {
      setError("Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/reset-password/${token}`, { password });
      setSuccess(res.data.message);
      setPassword("");
      setConfirmPassword("");

      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <Card style={{ width: "400px", padding: "30px", background: "#2a2a2a", color: "#fff" }}>
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Reset Password</h2>
        <Form onSubmit={handleSubmit}>

          <Form.Group className="mb-3">
            <Form.Label>New Password</Form.Label>
            <InputGroup>
              <Form.Control
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
              />
              <Button
                variant="secondary"
                onClick={() => setShowPassword(!showPassword)}
                style={{ border: "none", background: "transparent" }}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </Button>
            </InputGroup>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Confirm Password</Form.Label>
            <InputGroup>
              <Form.Control
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
              />
              <Button
                variant="secondary"
                onClick={() => setShowPassword(!showPassword)}
                style={{ border: "none", background: "transparent" }}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </Button>
            </InputGroup>
          </Form.Group>

          {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
          {success && <p style={{ color: "green", textAlign: "center" }}>{success}</p>}

          <Button type="submit" className="w-100" style={{ background: "#1a37aa", border: "none" }}>
            Reset Password
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default ResetPassword;
