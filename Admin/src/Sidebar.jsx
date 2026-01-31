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
  const location = useLocation();

  const toggleSidebar = () => setShow(!show);
  const isActive = (path) => location.pathname === path;

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

  const MenuItems = ({ onClick }) => (
    <>
      <Nav.Link className={`navlinks ${isActive("/home") && "active-link"}`} style={navItemStyle} onClick={() => onClick("/home")}>
        <FaHome /> Home
      </Nav.Link>

      <Nav.Link className={`navlinks ${isActive("/addproducts") && "active-link"}`} style={navItemStyle} onClick={() => onClick("/addproducts")}>
        <LuBox /> Add Products
      </Nav.Link>

      <Nav.Link className={`navlinks ${isActive("/Products") && "active-link"}`} style={navItemStyle} onClick={() => onClick("/Products")}>
        <CiViewList /> Products
      </Nav.Link>

      <Nav.Link className={`navlinks ${isActive("/addcategory") && "active-link"}`} style={navItemStyle} onClick={() => onClick("/addcategory")}>
        <TbCategory2 /> Add Category
      </Nav.Link>

      <Nav.Link className={`navlinks ${isActive("/suppliers") && "active-link"}`} style={navItemStyle} onClick={() => onClick("/suppliers")}>
        <FaRegUser /> Suppliers
      </Nav.Link>

      <Nav.Link className={`navlinks ${isActive("/Customers") && "active-link"}`} style={navItemStyle} onClick={() => onClick("/Customers")}>
        <FaRegUser /> Customers
      </Nav.Link>

      <Nav.Link className={`navlinks ${isActive("/stocks") && "active-link"}`} style={navItemStyle} onClick={() => onClick("/stocks")}>
        <CiViewList /> Stocks
      </Nav.Link>

      <Nav.Link className={`navlinks ${isActive("/billing") && "active-link"}`} style={navItemStyle} onClick={() => onClick("/billing")}>
        <MdDocumentScanner /> Sales Bill
      </Nav.Link>

      <Nav.Link className={`navlinks ${isActive("/purchasebill") && "active-link"}`} style={navItemStyle} onClick={() => onClick("/purchasebill")}>
        <MdDocumentScanner /> Purchase Bill
      </Nav.Link>

      <Nav.Link className={`navlinks ${isActive("/invoices") && "active-link"}`} style={navItemStyle} onClick={() => onClick("/invoices")}>
        <FiFileText /> Sales Invoices
      </Nav.Link>

      <Nav.Link className={`navlinks ${isActive("/credits") && "active-link"}`} style={navItemStyle} onClick={() => onClick("/credits")}>
        <FiFileText /> Credits
      </Nav.Link>

      <Nav.Link className={`navlinks ${isActive("/purchaseinvoices") && "active-link"}`} style={navItemStyle} onClick={() => onClick("/purchaseinvoices")}>
        <FiFileText /> Purchase Invoices
      </Nav.Link>

      <Nav.Link className={`navlinks ${isActive("/unit") && "active-link"}`} style={navItemStyle} onClick={() => onClick("/unit")}>
        <FaBalanceScale /> Unit
      </Nav.Link>
    </>
  );

  return (
    <>
      {/* 🔹 MOBILE MENU BUTTON */}
      <Button
        variant="dark"
        className="d-md-none"
        onClick={toggleSidebar}
        style={{
          position: "fixed",
          top: "10px",
          left: "10px",
          zIndex: 1200,
          borderRadius: "10px",
        }}
      >
        ☰
      </Button>

      {/* 🔹 DESKTOP SIDEBAR */}
      <div
        className="d-none d-md-flex flex-column position-fixed p-3 sidebar"
      >
        <h3 className="billq" onClick={() => navigate("/home")}>
          Bill<span style={{color:"rgb(205, 162, 7)"}}>Q</span>
        </h3>

        <h5 className="mb-4 text-white">
          <MdOutlineDashboard /> Dashboard
        </h5>

        <Nav className="flex-column w-100">
          <MenuItems onClick={(path) => navigate(path)} />
        </Nav>
      </div>

      {/* 🔹 MOBILE OFFCANVAS */}
      <Offcanvas
        show={show}
        onHide={toggleSidebar}
        placement="start"
        className="d-md-none"
        style={{ background: "#1e1e1e" }}
      >
        <Offcanvas.Header >
          <Offcanvas.Title className="text-white" style={{ fontWeight: "600", fontSize: "24px", marginTop: "60px" }}>
            Bill<span style={{color:"rgb(205, 162, 7)"}}>Q</span>
          </Offcanvas.Title>
        </Offcanvas.Header>

        <Offcanvas.Body>
          <Nav className="flex-column">
            <MenuItems
              onClick={(path) => {
                navigate(path);
                toggleSidebar();
              }}
            />
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default Sidebar;
