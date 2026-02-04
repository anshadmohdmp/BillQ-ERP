import React from "react";
import Home from "./Home";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Addproducts from "./Addproducts";
import Sidebar from "./Sidebar";
import AddCategory from "./AddCategory";
import AddSuppliers from "./AddSuppliers";
import Suppliers from "./Suppliers";
import Billing from "./Billing";
import Unit from "./Unit";
import Invoices from "./Invoices";
import Editstock from "./Editstock";
import Editsuppliers from "./Editsuppliers";
import Editunit from "./Editunit";
import EditCategory from "./EditCategory";
import Welcome from "./Welcome";

import Purchaseinvoices from "./Purchaseinvoices";
import Customers from "./Customers";
import AddCustomers from "./AddCustomers";
import EditCustomers from "./EditCustomers";
import Products from "./Products";
import Stocks from "./Stocks";
import PurchaseBill from "./PurchaseBill";
import Credits from "./Credits";
import Brand from "./Brand";

// Separate component so we can use hooks like useLocation
const AppContent= () => {
  const location = useLocation();

  // Hide sidebar only on Welcome page
  const hideSidebar = location.pathname === "/";

  return (
    
    <div className={`layout ${hideSidebar ? "no-sidebar" : ""}`}>
      {!hideSidebar && <Sidebar />}

<div className="page-content">
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/home" element={<Home />} />
        <Route path="/addproducts" element={<Addproducts />} />
        <Route path="/addcategory" element={<AddCategory />} />
        <Route path="/addsuppliers" element={<AddSuppliers />} />
        <Route path="/Products" element={<Products />} />
        <Route path="/suppliers" element={<Suppliers />} />
        <Route path="/Customers" element={<Customers />} />
         <Route path="/brand" element={<Brand />} />
        <Route path="/billing" element={<Billing />} />
        <Route path="/purchaseinvoices" element={<Purchaseinvoices/>} />
        <Route path="/addCustomers" element={<AddCustomers/>} />
        <Route path="/editCustomers/:id" element={<EditCustomers />} />
        <Route path="/unit" element={<Unit />} />
        <Route path="/invoices" element={<Invoices />} />
        <Route path="/credits" element={<Credits />} />
        <Route path="/editstock/:id" element={<Editstock />} />
        <Route path="/editsuppliers/:id" element={<Editsuppliers />} />
        <Route path="/editunit/:id" element={<Editunit />} />
        <Route path="/editcategory/:id" element={<EditCategory />} />
        <Route path="/purchasebill" element={<PurchaseBill />} />
        <Route path="/stocks" element={<Stocks />} />
      </Routes>
    </div>
    </div>
  );
};

const App = () => (
  <BrowserRouter>
    <AppContent />
  </BrowserRouter>
);

export default App;
