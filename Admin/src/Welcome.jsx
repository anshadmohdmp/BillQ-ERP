import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../src/Css/Welcome.css";

const Welcome = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/home");
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <motion.div
      className="welcome-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      <motion.h1
        className="welcome-title"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        👋 Welcome to{" "}
        <motion.span
          className="brand-name"
          animate={{
            scale: [1, 1.1, 1],
            transition: { repeat: Infinity, duration: 1.5 },
          }}
        >
          BillQ
        </motion.span>
      </motion.h1>

      <motion.p
        className="welcome-subtext"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.5 }}
      >
        Your Smart ERP & Billing System
      </motion.p>

      <motion.div
        className="loading-bar"
        initial={{ width: "0%" }}
        animate={{ width: "80%" }}
        transition={{ duration: 2.5, ease: "easeInOut" }}
      />
    </motion.div>
  );
};

export default Welcome;
