import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import { placeOrder, createRazorpayOrder, verifyPayment } from "../utils/api";
import { toast } from "react-toastify";
import "./Checkout.css";

const SHIPPING_FEE = 49;

const Checkout = () => {
  const { store, cart, cartTotal, clearCart } = useStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const shipping = cartTotal >= 499 ? 0 : SHIPPING_FEE;
  const grandTotal = cartTotal + shipping;

  const [form, setForm] = useState({
    name: "", email: "", phone: "",
    street: "", city: "", state: "", pincode: "",
    notes: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "Valid email required";
    if (!form.phone.match(/^[6-9]\d{9}$/)) e.phone = "Valid 10-digit Indian mobile required";
    if (!form.street.trim()) e.street = "Address required";
    if (!form.city.trim()) e.city = "City required";
    if (!form.state.trim()) e.state = "State required";
    if (!form.pincode.match(/^\d{6}$/)) e.pincode = "Valid 6-digit pincode required";
    return e;
  };

  const handlePayment = async () => {
    const validation = validate();
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      toast.error("Please fix the form errors.");
      return;
    }
    if (cart.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    setLoading(true);
    try {
      // 1. Create order in DB (pending)
      const orderPayload = {
        storeId: store._id,
        customer: { name: form.name, email: form.email, phone: form.phone },
        shippingAddress: { street: form.street, city: form.city, state: form.state, pincode: form.pincode },
        items: cart.map((item) => ({
          productId: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          imageUrl: item.images?.[0] || "",
        })),
        subtotal: cartTotal,
        shippingCharge: shipping,
        totalAmount: grandTotal,
        notes: form.notes,
      };

      const { data: order } = await placeOrder(orderPayload);

      // 2. Create Razorpay order
      const { data: razorpayData } = await createRazorpayOrder({
        storeId: store._id,
        amount: grandTotal,
        currency: store.payment?.currency || "INR",
        orderId: order._id,
      });

      // 3. Open Razorpay payment modal
      const razorpayKey = store.payment?.razorpayKeyId || process.env.REACT_APP_RAZORPAY_KEY_ID;

      const rzpOptions = {
        key: razorpayKey,
        amount: razorpayData.amount,
        currency: razorpayData.currency,
        name: store.storeName,
        description: `Order #${order._id.slice(-8).toUpperCase()}`,
        image: store.logoUrl,
        order_id: razorpayData.razorpayOrderId,
        handler: async (response) => {
          try {
            // 4. Verify payment
            await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: order._id,
              storeId: store._id,
            });
            clearCart();
            toast.success("Payment successful! 🎉");
            navigate(`/order-success/${order._id}`);
          } catch {
            toast.error("Payment verification failed. Contact support.");
          }
        },
        prefill: { name: form.name, email: form.email, contact: form.phone },
        theme: { color: store.theme?.primaryColor || "#6366f1" },
        modal: {
          ondismiss: () => {
            toast.info("Payment cancelled.");
            setLoading(false);
          },
        },
      };

      if (!window.Razorpay) {
        toast.error("Razorpay SDK not loaded. Check your internet connection.");
        setLoading(false);
        return;
      }

      const rzp = new window.Razorpay(rzpOptions);
      rzp.on("payment.failed", () => {
        toast.error("Payment failed. Please try again.");
        setLoading(false);
      });
      rzp.open();
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page">
      <div className="checkout-inner">
        <h1 className="checkout-title">Checkout</h1>

        <div className="checkout-layout">
          {/* ── Form ─────────────────────────────────────── */}
          <div className="checkout-form">
            <section className="form-section">
              <h2>Contact Information</h2>
              <div className="form-grid">
                <Field label="Full Name" name="name" value={form.name} onChange={handleChange} error={errors.name} />
                <Field label="Email" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} />
                <Field label="Mobile Number" name="phone" type="tel" value={form.phone} onChange={handleChange} error={errors.phone} placeholder="10-digit mobile" />
              </div>
            </section>

            <section className="form-section">
              <h2>Shipping Address</h2>
              <div className="form-grid">
                <Field label="Street / Flat / Area" name="street" value={form.street} onChange={handleChange} error={errors.street} fullWidth />
                <Field label="City" name="city" value={form.city} onChange={handleChange} error={errors.city} />
                <Field label="State" name="state" value={form.state} onChange={handleChange} error={errors.state} />
                <Field label="Pincode" name="pincode" value={form.pincode} onChange={handleChange} error={errors.pincode} />
              </div>
            </section>

            <section className="form-section">
              <h2>Order Notes <span className="optional">(optional)</span></h2>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                placeholder="Any special instructions..."
                rows={3}
                className="form-textarea"
              />
            </section>
          </div>

          {/* ── Order Summary ─────────────────────────────── */}
          <div className="checkout-summary">
            <h2>Order Summary</h2>
            <div className="summary-items">
              {cart.map((item) => (
                <div key={item._id} className="summary-item">
                  <img src={item.images?.[0] || "https://placehold.co/56x56?text=•"} alt={item.name} />
                  <div>
                    <p>{item.name}</p>
                    <small>Qty: {item.quantity}</small>
                  </div>
                  <span>₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
                </div>
              ))}
            </div>
            <div className="summary-total-rows">
              <div className="str"><span>Subtotal</span><span>₹{cartTotal.toLocaleString("en-IN")}</span></div>
              <div className="str"><span>Shipping</span><span>{shipping === 0 ? <b className="free">FREE</b> : `₹${shipping}`}</span></div>
              <div className="str total"><span>Total</span><span>₹{grandTotal.toLocaleString("en-IN")}</span></div>
            </div>

            <div className="payment-badge">🔒 Secured by Razorpay</div>

            <button className="btn-pay" onClick={handlePayment} disabled={loading}>
              {loading ? "Processing..." : `Pay ₹${grandTotal.toLocaleString("en-IN")}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Small reusable field component
const Field = ({ label, name, value, onChange, error, type = "text", placeholder, fullWidth }) => (
  <div className={`form-field${fullWidth ? " full-width" : ""}`}>
    <label>{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder || label}
      className={error ? "input-error" : ""}
    />
    {error && <span className="field-error">{error}</span>}
  </div>
);

export default Checkout;
