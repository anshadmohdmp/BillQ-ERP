import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Welcome = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/home"); // Redirect after 3 seconds
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      style={{
        height: "100vh",
        background: "linear-gradient(135deg, #1e1e1e, #3a3a3a)",
        color: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Poppins, sans-serif",
        overflow: "hidden",
      }}
    >
      {/* Main Heading */}
      <motion.h1
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        style={{ fontSize: "48px", marginBottom: "10px" }}
      >
        👋 Welcome to{" "}
        <motion.span
          style={{ color: "#00bcd4", display: "inline-block" }}
          animate={{
            scale: [1, 1.1, 1],
            transition: { repeat: Infinity, duration: 1.5 },
          }}
        >
          BillIQ
        </motion.span>
      </motion.h1>

      {/* Subtext */}
      <motion.p
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.5 }}
        style={{ color: "#ccc", fontSize: "18px" }}
      >
        Your Smart ERP & Billing System
      </motion.p>

      {/* Animated Loading Bar */}
      <motion.div
        initial={{ width: "0%" }}
        animate={{ width: "80%" }}
        transition={{ duration: 2.5, ease: "easeInOut" }}
        style={{
          height: "6px",
          borderRadius: "5px",
          background:
            "linear-gradient(90deg, #00bcd4, #0097a7, #26c6da, #00bcd4)",
          marginTop: "30px",
          boxShadow: "0 0 10px rgba(0, 188, 212, 0.6)",
        }}
      />
    </motion.div>
  );
};

export default Welcome;
