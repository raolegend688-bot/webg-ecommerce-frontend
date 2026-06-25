import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import "./Cart.css";

const Cart = () => {
  const { cart, updateQty, removeFromCart, cartTotal } = useStore();
  const navigate = useNavigate();

  const SHIPPING = cartTotal >= 499 ? 0 : 49;
  const grandTotal = cartTotal + SHIPPING;

  if (cart.length === 0) {
    return (
      <div className="cart-empty">
        <div className="cart-empty-inner">
          <div className="cart-empty-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Add some products to continue shopping.</p>
          <Link to="/products" className="btn-shop">Browse Products</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-inner">
        <h1 className="cart-title">Your Cart ({cart.length} item{cart.length !== 1 ? "s" : ""})</h1>

        <div className="cart-layout">
          {/* ── Items ──────────────────────────────────── */}
          <div className="cart-items">
            {cart.map((item) => (
              <div key={item._id} className="cart-item">
                <img
                  src={item.images?.[0] || "https://placehold.co/100x100?text=No+Image"}
                  alt={item.name}
                  className="cart-item-img"
                />
                <div className="cart-item-info">
                  <h3 className="cart-item-name">{item.name}</h3>
                  <span className="cart-item-cat">{item.category}</span>
                  <span className="cart-item-price">₹{item.price.toLocaleString("en-IN")}</span>
                </div>
                <div className="cart-item-controls">
                  <div className="qty-row">
                    <button onClick={() => updateQty(item._id, item.quantity - 1)}>−</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQty(item._id, item.quantity + 1)}>+</button>
                  </div>
                  <span className="cart-item-subtotal">
                    ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                  </span>
                  <button className="btn-remove" onClick={() => removeFromCart(item._id)}>🗑</button>
                </div>
              </div>
            ))}
          </div>

          {/* ── Summary ────────────────────────────────── */}
          <div className="cart-summary">
            <h2>Order Summary</h2>
            <div className="summary-rows">
              <div className="summary-row"><span>Subtotal</span><span>₹{cartTotal.toLocaleString("en-IN")}</span></div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>{SHIPPING === 0 ? <span className="free">FREE</span> : `₹${SHIPPING}`}</span>
              </div>
              {SHIPPING > 0 && (
                <div className="summary-hint">Add ₹{(499 - cartTotal).toLocaleString("en-IN")} more for free shipping</div>
              )}
              <div className="summary-divider" />
              <div className="summary-row total"><span>Total</span><span>₹{grandTotal.toLocaleString("en-IN")}</span></div>
            </div>
            <button className="btn-checkout" onClick={() => navigate("/checkout")}>
              Proceed to Checkout →
            </button>
            <Link to="/products" className="btn-continue">← Continue Shopping</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
