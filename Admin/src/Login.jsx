import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Card, Form, Button, InputGroup } from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "./AuthProvider";
import GoogleButton from "./GoogleButton" 
import "./Css/Login.css"


const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/login`,
        { username, password }
      );

      // ✅ store via context
      login(res.data.token, res.data.user, rememberMe);

      navigate("/home");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  const inputStyle = {
    border: "none",
    borderRadius: "10px",
    padding: "12px",
    color: "#fff",
    background: "#3a3a3a",
    boxShadow:
      "inset 3px 3px 6px rgba(0,0,0,0.6), inset -3px -3px 6px rgba(255,255,255,0.05)",
    cursor:"pointer"
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 login">
      <Card
        style={{
          width: "400px",
          padding: "30px",
          background: "#2a2a2a",
          color: "#fff",
        }}
      >
        <h2 className="text-center mb-4">Login</h2>

        <Form onSubmit={handleLogin}>
          {/* Username */}
          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              required
              style={inputStyle}
            />
          </Form.Group>

          {/* Password with eye */}
          <Form.Group className="mb-2">
            <Form.Label>Password</Form.Label>
            <InputGroup>
              <Form.Control
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                style={inputStyle}
              />
              <InputGroup.Text
                
                onClick={() => setShowPassword(!showPassword)}
                style={inputStyle}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </InputGroup.Text>
            </InputGroup>
          </Form.Group>

          {/* Remember + Forgot */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <Form.Check
              type="checkbox"
              label="Remember me"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />

            <Link to="/forgot-password" style={{ fontSize: "14px",color:"orange" }}>
              Forgot password?
            </Link>
          </div>

          {error && (
            <p className="text-danger text-center">{error}</p>
          )}

          <Button
            type="submit"
            className="w-100"
            style={{ background: "#c0941b", border: "none" }}
          >
            Login
          </Button>
          <hr style={{ borderColor: "#555" }} />

<div className="d-flex justify-content-center mb-3">
  <GoogleButton />
</div>
        </Form>

        <p className="mt-3 text-center">
          Don&apos;t have an account? <Link to="/register" style={{color:"orange"}}>Register</Link>
        </p>
      </Card>
    </div>
  );
};

export default Login;
