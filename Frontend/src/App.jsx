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
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import CheckOut from "./pages/Checkout"
import OrderSuccess from "./pages/OrderSuccess";

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
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart/" element={<Cart />} />
          <Route path="/checkout" element={<CheckOut />} />
          <Route path="/order-success" element={<OrderSuccess />} />
      </Routes>

      <Footer />
    </>
  );
};

export default App;