import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
const Home = lazy(() => import("./Home"));
const Addproducts = lazy(() => import("./Addproducts"));
const AddCategory = lazy(() => import("./AddCategory"));
const AddSuppliers = lazy(() => import("./AddSuppliers"));
const Suppliers = lazy(() => import("./Suppliers"));
const Billing = lazy(() => import("./Billing"));
const Unit = lazy(() => import("./Unit"));
const Invoices = lazy(() => import("./Invoices"));
const Editstock = lazy(() => import("./Editstock"));
const Editsuppliers = lazy(() => import("./Editsuppliers"));
const Editunit = lazy(() => import("./Editunit"));
const EditCategory = lazy(() => import("./EditCategory"));
const Welcome = lazy(() => import("./Welcome"));
const Purchaseinvoices = lazy(() => import("./Purchaseinvoices"));
const Customers = lazy(() => import("./Customers"));
const AddCustomers = lazy(() => import("./AddCustomers"));
const EditCustomers = lazy(() => import("./EditCustomers"));
const Products = lazy(() => import("./Products"));
const Stocks = lazy(() => import("./Stocks"));
const PurchaseBill = lazy(() => import("./PurchaseBill"));
const Credits = lazy(() => import("./Credits"));
const Brand = lazy(() => import("./Brand"));
const Editbrand = lazy(() => import("./Editbrand"));
const Itemcategory = lazy(() => import("./Itemcategory"));
const EditItemcategory = lazy(() => import("./EditItemcategory"));
const Login = lazy(() => import("./Login"));
const Register = lazy(() => import("./Register"));
const ForgotPassword = lazy(() => import("./ForgetPassword"));
const ResetPassword = lazy(() => import("./ResetPassword"));

import ProtectedRoute from "./ProtectedRoute";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { useAuth } from "./AuthProvider"; 
import Sidebar from "./Sidebar";

// Protected Route 


// App Content with Sidebar logic
const AppContent = () => {
  const location = useLocation();
  const hideSidebar = ["/", "/login", "/register", "/forgot-password", "reset-password/:token"].includes(location.pathname);

  return (
    <div className={`layout ${hideSidebar ? "no-sidebar" : ""}`}>
      {!hideSidebar && <Sidebar />}

      <div className="page-content">
        <Suspense
    fallback={
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-warning" role="status"></div>
      </div>
    }
  >
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
        </Suspense>
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
