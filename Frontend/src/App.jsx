import React from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Return from "./pages/ReturnPolicy";
import Disclaimer from "./pages/Disclaimer";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Term from "./pages/Terms";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyOtp from "./pages/VerifyOtp";
import ForgotPassword from "./pages/ForgotPassword";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import CheckOut from "./pages/Checkout"
import OrderSuccess from "./pages/OrderSuccess";
import Profile from "./pages/Profile";
import AdminDashboard from "./admin/AdminDashboard";
import AddProduct from "./admin/AddProduct";
import EditProduct from "./admin/EditProduct";
import AdminProduct from "./admin/AdminProduct";
import AdminOrders from "./admin/AdminOrders";
import AdminUsers from "./admin/AdminUsers";

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/return" element={<Return />} />
          <Route path ="/disclaimer" element ={<Disclaimer/>}/>
          <Route path ="/privacy" element ={<PrivacyPolicy/>}/>
          <Route path ="/terms" element ={<Term/>}/>
          <Route path= "/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/register/verify-otp" element={<VerifyOtp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart/" element={<Cart />} />
          <Route path="/checkout" element={<CheckOut />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/profile" element={<Profile />} />
          <Route path ="/admin" element ={<AdminDashboard />}/>
          <Route path = "/admin/add-product" element ={<AddProduct />}/>
          <Route path = "/admin/edit-product/:id" element ={<EditProduct />}/>
          <Route path = "/admin/products" element ={<AdminProduct />}/>
          <Route path = "/admin/orders" element ={<AdminOrders />}/>
          <Route path = "/admin/users" element ={<AdminUsers />}/>
         
      </Routes>

      <Footer />
    </>
  );
};

export default App;
