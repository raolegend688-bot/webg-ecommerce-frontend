import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { StoreProvider } from "./context/StoreContext";
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";

// ── Store slug — injected by webG at build/runtime ───────────
// In webG integration: pass via env var or URL param
const STORE_SLUG = process.env.REACT_APP_STORE_SLUG || "demo-store";

function App() {
  return (
    <BrowserRouter>
      <StoreProvider storeSlug={STORE_SLUG}>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success/:id" element={<OrderSuccess />} />
        </Routes>
        <ToastContainer position="bottom-right" autoClose={3000} />
      </StoreProvider>
    </BrowserRouter>
  );
}

export default App;
