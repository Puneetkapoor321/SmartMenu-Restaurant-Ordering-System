import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Splash from "./pages/Splash";
import Menu from "./pages/Menu";
import Cart from "./pages/Cart";
import OrderConfirmed from "./pages/OrderConfirmed";
import Admin from "./pages/Admin";

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Splash />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order-confirmed" element={<OrderConfirmed />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
