import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Home from "./Home";
import Addproducts from "./Addproducts";
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
import Editbrand from "./Editbrand";
import Itemcategory from "./Itemcategory";
import EditItemcategory from "./EditItemcategory";
import Sidebar from "./Sidebar";
import Login from "./Login";
import Register from "./Register";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { useAuth } from "./AuthProvider"; 
import ForgotPassword from "./ForgetPassword";
import ResetPassword from "./ResetPassword";
import ProtectedRoute from "./ProtectedRoute";

// Protected Route 


// App Content with Sidebar logic
const AppContent = () => {
  const location = useLocation();
  const hideSidebar = ["/", "/login", "/register", "/forgot-password", "reset-password/:token"].includes(location.pathname);

  return (
    <div className={`layout ${hideSidebar ? "no-sidebar" : ""}`}>
      {!hideSidebar && <Sidebar />}

      <div className="page-content">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* Protected Routes */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/addproducts"
            element={
              <ProtectedRoute>
                <Addproducts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/addcategory"
            element={
              <ProtectedRoute>
                <AddCategory />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/addsuppliers"
            element={
              <ProtectedRoute>
                <AddSuppliers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Products"
            element={
              <ProtectedRoute>
                <Products />
              </ProtectedRoute>
            }
          />
          <Route
            path="/suppliers"
            element={
              <ProtectedRoute>
                <Suppliers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Customers"
            element={
              <ProtectedRoute>
                <Customers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/brand"
            element={
              <ProtectedRoute>
                <Brand />
              </ProtectedRoute>
            }
          />
          <Route
            path="/itemcategory"
            element={
              <ProtectedRoute>
                <Itemcategory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/billing"
            element={
              <ProtectedRoute>
                <Billing />
              </ProtectedRoute>
            }
          />
          <Route
            path="/purchaseinvoices"
            element={
              <ProtectedRoute>
                <Purchaseinvoices />
              </ProtectedRoute>
            }
          />
          <Route
            path="/addCustomers"
            element={
              <ProtectedRoute>
                <AddCustomers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/editCustomers/:id"
            element={
              <ProtectedRoute>
                <EditCustomers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/unit"
            element={
              <ProtectedRoute>
                <Unit />
              </ProtectedRoute>
            }
          />
          <Route
            path="/invoices"
            element={
              <ProtectedRoute>
                <Invoices />
              </ProtectedRoute>
            }
          />
          <Route
            path="/credits"
            element={
              <ProtectedRoute>
                <Credits />
              </ProtectedRoute>
            }
          />
          <Route
            path="/editstock/:id"
            element={
              <ProtectedRoute>
                <Editstock />
              </ProtectedRoute>
            }
          />
          <Route
            path="/editsuppliers/:id"
            element={
              <ProtectedRoute>
                <Editsuppliers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/editunit/:id"
            element={
              <ProtectedRoute>
                <Editunit />
              </ProtectedRoute>
            }
          />
          <Route
            path="/editbrand/:id"
            element={
              <ProtectedRoute>
                <Editbrand />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edititemcategory/:id"
            element={
              <ProtectedRoute>
                <EditItemcategory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/editcategory/:id"
            element={
              <ProtectedRoute>
                <EditCategory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/purchasebill"
            element={
              <ProtectedRoute>
                <PurchaseBill />
              </ProtectedRoute>
            }
          />
          <Route
            path="/stocks"
            element={
              <ProtectedRoute>
                <Stocks />
              </ProtectedRoute>
            }
          />
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
