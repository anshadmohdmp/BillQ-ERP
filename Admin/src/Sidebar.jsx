import React, { useState } from "react";
import { Nav, Button, Offcanvas } from "react-bootstrap";
import { MdOutlineDashboard, MdDocumentScanner } from "react-icons/md";
import { FaHome, FaRegUser, FaBalanceScale } from "react-icons/fa";
import { CiViewList } from "react-icons/ci";
import { LuBox } from "react-icons/lu";
import { TbCategory2 } from "react-icons/tb";
import { FiFileText } from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";
import "./Css/Sidebar.css";

const Sidebar = () => {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // Detect current route

  const toggleSidebar = () => setShow(!show);

  const navItemStyle = {
    padding: "12px 15px",
    borderRadius: "12px",
    marginBottom: "8px",
    transition: "0.3s",
    background:
      "linear-gradient(145deg, rgba(255,255,255,0.05), rgba(0,0,0,0.2))",
    boxShadow:
      "3px 3px 8px rgba(0,0,0,0.6), -3px -3px 8px rgba(255,255,255,0.1)",
    color: "white",
  };

  const hoverEffect = (e) => {
    e.target.style.transform = "translateY(-3px)";
    e.target.style.boxShadow =
      "6px 6px 15px rgba(0,0,0,0.7), -3px -3px 10px rgba(255,255,255,0.15)";
  };

  const leaveEffect = (e) => {
    e.target.style.transform = "translateY(0)";
    e.target.style.boxShadow =
      "3px 3px 8px rgba(0,0,0,0.6), -3px -3px 8px rgba(255,255,255,0.1)";
  };

  const changepage = () => {
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile toggle button */}
      <Button
        variant="dark"
        className="d-md-none m-2"
        onClick={toggleSidebar}
        style={{
          borderRadius: "10px",
          boxShadow: "3px 3px 6px rgba(0,0,0,0.5)",
        }}
      >
        ☰ Menu
      </Button>

      {/* Desktop sidebar */}
      <div
        className="d-none d-md-flex flex-column align-items-start position-fixed p-3"
        style={{
          width: "250px",
          height: "100vh",
          overflowY: "auto", // ✅ Enables vertical scroll
          scrollbarWidth: "thin",
          scrollbarColor: "#555 #2c2c2c",
          background: "linear-gradient(180deg, #1e1e1e, #2c2c2c)",
          boxShadow:
            "inset -4px -4px 10px rgba(255,255,255,0.05), inset 4px 4px 12px rgba(0,0,0,0.8)",
          borderRight: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <h3
          className="billq"
          style={{
            marginLeft: "70px",
            cursor: "pointer",
            marginTop: "20px",
            color: "white",
          }}
          onClick={changepage}
        >
          BillIQ
        </h3>

        <h5
          className="mb-4"
          style={{
            color: "white",
            fontWeight: "600",
            marginTop: "30px",
            textShadow: "2px 2px 6px rgba(0,0,0,0.6)",
          }}
        >
          <MdOutlineDashboard /> Dashboard
        </h5>

        <Nav className="flex-column w-100">
          <Nav.Link
            className={`navlinks ${isActive("/home") ? "active-link" : ""}`}
            style={navItemStyle}
            onMouseEnter={hoverEffect}
            onMouseLeave={leaveEffect}
            onClick={() => navigate("/home")}
          >
            <FaHome /> Home
          </Nav.Link>

          <Nav.Link
            className={`navlinks ${isActive("/addproducts") ? "active-link" : ""}`}
            style={navItemStyle}
            onMouseEnter={hoverEffect}
            onMouseLeave={leaveEffect}
            onClick={() => navigate("/addproducts")}
          >
            <LuBox /> Add Products
          </Nav.Link>

          <Nav.Link
            className={`navlinks ${isActive("/Products") ? "active-link" : ""}`}
            style={navItemStyle}
            onMouseEnter={hoverEffect}
            onMouseLeave={leaveEffect}
            onClick={() => navigate("/Products")}
          >
            <CiViewList /> Products
          </Nav.Link>

          <Nav.Link
            className={`navlinks ${isActive("/addcategory") ? "active-link" : ""}`}
            style={navItemStyle}
            onMouseEnter={hoverEffect}
            onMouseLeave={leaveEffect}
            onClick={() => navigate("/addcategory")}
          >
            <TbCategory2 /> Add Category
          </Nav.Link>

          <Nav.Link
            className={`navlinks ${isActive("/suppliers") ? "active-link" : ""}`}
            style={navItemStyle}
            onMouseEnter={hoverEffect}
            onMouseLeave={leaveEffect}
            onClick={() => navigate("/suppliers")}
          >
            <FaRegUser /> Suppliers
          </Nav.Link>

          <Nav.Link
            className={`navlinks ${isActive("/Customers") ? "active-link" : ""}`}
            style={navItemStyle}
            onMouseEnter={hoverEffect}
            onMouseLeave={leaveEffect}
            onClick={() => navigate("/Customers")}
          >
            <FaRegUser /> Customers
          </Nav.Link>

          <Nav.Link
            className={`navlinks ${isActive("/stocks") ? "active-link" : ""}`}
            style={navItemStyle}
            onMouseEnter={hoverEffect}
            onMouseLeave={leaveEffect}
            onClick={() => navigate("/stocks")}
          >
            <CiViewList /> Stocks
          </Nav.Link>

          <Nav.Link
            className={`navlinks ${isActive("/billing") ? "active-link" : ""}`}
            style={navItemStyle}
            onMouseEnter={hoverEffect}
            onMouseLeave={leaveEffect}
            onClick={() => navigate("/billing")}
          >
            <MdDocumentScanner /> Sales Bill
          </Nav.Link>

          <Nav.Link
            className={`navlinks ${isActive("/purchasebill") ? "active-link" : ""}`}
            style={navItemStyle}
            onMouseEnter={hoverEffect}
            onMouseLeave={leaveEffect}
            onClick={() => navigate("/purchasebill")}
          >
            <MdDocumentScanner /> Purchase Bill
          </Nav.Link>

          <Nav.Link
            className={`navlinks ${isActive("/invoices") ? "active-link" : ""}`}
            style={navItemStyle}
            onMouseEnter={hoverEffect}
            onMouseLeave={leaveEffect}
            onClick={() => navigate("/invoices")}
          >
            <FiFileText /> Sales Invoices
          </Nav.Link>

          <Nav.Link
            className={`navlinks ${isActive("/credits") ? "active-link" : ""}`}
            style={navItemStyle}
            onMouseEnter={hoverEffect}
            onMouseLeave={leaveEffect}
            onClick={() => navigate("/credits")}
          >
            <FiFileText /> Credits
          </Nav.Link>

          <Nav.Link
            className={`navlinks ${isActive("/purchaseinvoices") ? "active-link" : ""}`}
            style={navItemStyle}
            onMouseEnter={hoverEffect}
            onMouseLeave={leaveEffect}
            onClick={() => navigate("/purchaseinvoices")}
          >
            <FiFileText /> Purchase Invoices
          </Nav.Link>

          <Nav.Link
            className={`navlinks ${isActive("/unit") ? "active-link" : ""}`}
            style={navItemStyle}
            onMouseEnter={hoverEffect}
            onMouseLeave={leaveEffect}
            onClick={() => navigate("/unit")}
          >
            <FaBalanceScale /> Unit
          </Nav.Link>
        </Nav>
      </div>

      {/* Mobile offcanvas */}
      <Offcanvas show={show} onHide={toggleSidebar} responsive="md">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-column">
            <Nav.Link onClick={() => navigate("/home")}>Home</Nav.Link>
            <Nav.Link onClick={() => navigate("/addproducts")}>Add Products</Nav.Link>
            <Nav.Link onClick={() => navigate("/stocks")}>Stocks</Nav.Link>
            <Nav.Link onClick={() => navigate("/billing")}>Bill</Nav.Link>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default Sidebar;
