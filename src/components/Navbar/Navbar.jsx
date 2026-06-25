import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../../context/StoreContext";
import "./Navbar.css";

const Navbar = () => {
  const { store, cartCount } = useStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchVal.trim())}`);
      setSearchVal("");
      setMenuOpen(false);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Logo */}
        <Link to="/" className="navbar-brand">
          {store?.logoUrl ? (
            <img src={store.logoUrl} alt={store.storeName} className="navbar-logo" />
          ) : (
            <span className="navbar-name">{store?.storeName || "Store"}</span>
          )}
        </Link>

        {/* Search */}
        <form className="navbar-search" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search products..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
          />
          <button type="submit">🔍</button>
        </form>

        {/* Links */}
        <div className={`navbar-links ${menuOpen ? "open" : ""}`}>
          <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/products" onClick={() => setMenuOpen(false)}>Products</Link>
          {store?.categories?.map((cat) => (
            <Link
              key={cat}
              to={`/products?category=${encodeURIComponent(cat)}`}
              onClick={() => setMenuOpen(false)}
            >
              {cat}
            </Link>
          ))}
        </div>

        {/* Cart */}
        <Link to="/cart" className="navbar-cart">
          🛒
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </Link>

        {/* Hamburger */}
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
