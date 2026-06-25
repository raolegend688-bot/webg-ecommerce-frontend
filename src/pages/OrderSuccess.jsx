import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getOrder } from "../utils/api";
import "./OrderSuccess.css";

const OrderSuccess = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    getOrder(id).then(({ data }) => setOrder(data)).catch(console.error);
  }, [id]);

  return (
    <div className="success-page">
      <div className="success-card">
        <div className="success-icon">🎉</div>
        <h1>Order Confirmed!</h1>
        <p>Thank you for your purchase. We'll process your order shortly.</p>

        {order && (
          <div className="order-details">
            <div className="order-id">Order ID: <strong>#{id.slice(-8).toUpperCase()}</strong></div>
            <div className="order-amount">Amount Paid: <strong>₹{order.totalAmount?.toLocaleString("en-IN")}</strong></div>
            <div className="order-status">Status: <span className="status-badge">{order.orderStatus}</span></div>
            <div className="order-customer">
              <p><strong>{order.customer?.name}</strong></p>
              <p>{order.customer?.email}</p>
              <p>{order.shippingAddress?.street}, {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}</p>
            </div>
          </div>
        )}

        <div className="success-actions">
          <Link to="/products" className="btn-back-shop">Continue Shopping</Link>
          <Link to="/" className="btn-home">Go Home</Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
