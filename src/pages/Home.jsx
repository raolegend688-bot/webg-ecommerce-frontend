import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import ProductCard from "../components/ProductCard/ProductCard";
import { getProducts } from "../utils/api";
import "./Home.css";

const MARQUEE_TEXT = "Free Shipping Above ₹499 ✦ Premium Quality ✦ Easy Returns ✦ Secured Payments ✦ New Arrivals ✦ Exclusive Deals ✦ ";

const Home = () => {
  const { store } = useStore();
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!store?._id) return;
    getProducts({ storeId: store._id, featured: "true", limit: 8 })
      .then(({ data }) => setFeatured(data.products))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [store]);

  return (
    <div className="home">
      {/* ── Hero ──────────────────────────────────────── */}
      <section className="hero">
        <div className="hero-content">
          {store?.logoUrl && (
            <img src={store.logoUrl} alt={store.storeName} className="hero-logo" />
          )}
          <span className="hero-eyebrow">✦ Premium Collection</span>
          <h1 className="hero-title">{store?.storeName || "The Store"}</h1>
          <p className="hero-tagline">{store?.tagline || "Quality products, delivered to you."}</p>
          <div className="hero-actions">
            <Link to="/products" className="btn-hero-primary">Shop Now</Link>
            {store?.categories?.[0] && (
              <Link to={`/products?category=${store.categories[0]}`} className="btn-hero-secondary">
                Browse {store.categories[0]}
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* ── Marquee ───────────────────────────────────── */}
      <div className="marquee-bar">
        <span className="marquee-track">
          {MARQUEE_TEXT.repeat(4).split("✦").map((text, i) => (
            <span key={i}>{text}{i < MARQUEE_TEXT.repeat(4).split("✦").length - 1 && <span className="marquee-sep">✦</span>}</span>
          ))}
        </span>
      </div>

      {/* ── Categories ────────────────────────────────── */}
      {store?.categories?.length > 0 && (
        <section className="section">
          <div className="section-inner">
            <h2 className="section-title">Shop by Category</h2>
            <div className="categories-grid">
              {store.categories.map((cat) => (
                <button
                  key={cat}
                  className="category-chip"
                  onClick={() => navigate(`/products?category=${encodeURIComponent(cat)}`)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Featured Products ─────────────────────────── */}
      <section className="section section-alt">
        <div className="section-inner">
          <div className="section-header">
            <h2 className="section-title">Featured Products</h2>
            <Link to="/products" className="view-all">View All →</Link>
          </div>

          {loading ? (
            <div className="grid-skeleton">
              {[...Array(4)].map((_, i) => <div key={i} className="skeleton-card" />)}
            </div>
          ) : featured.length === 0 ? (
            <p className="empty-text">No featured products yet.</p>
          ) : (
            <div className="products-grid">
              {featured.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          )}
        </div>
      </section>

      {/* ── Trust Bar ─────────────────────────────────── */}
      <section className="trust-bar">
        {[
          { icon: "🚚", label: "Free Delivery", sub: "On orders above ₹499" },
          { icon: "✦", label: "100% Authentic", sub: "Verified products only" },
          { icon: "🔄", label: "Easy Returns", sub: "7-day return policy" },
          { icon: "🔒", label: "Secure Payment", sub: "Powered by Razorpay" },
        ].map(({ icon, label, sub }) => (
          <div key={label} className="trust-item">
            <span className="trust-icon">{icon}</span>
            <strong>{label}</strong>
            <small>{sub}</small>
          </div>
        ))}
      </section>

      {/* ── Footer ────────────────────────────────────── */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <strong>{store?.storeName}</strong>
            <p>{store?.tagline}</p>
          </div>
          <div className="footer-links">
            <h4>Shop</h4>
            <Link to="/products">All Products</Link>
            {store?.categories?.map((cat) => (
              <Link key={cat} to={`/products?category=${encodeURIComponent(cat)}`}>{cat}</Link>
            ))}
          </div>
          <div className="footer-contact">
            <h4>Contact</h4>
            {store?.contact?.email && <a href={`mailto:${store.contact.email}`}>{store.contact.email}</a>}
            {store?.contact?.phone && <a href={`tel:${store.contact.phone}`}>{store.contact.phone}</a>}
            {store?.contact?.address && <p>{store.contact.address}</p>}
          </div>
          <div className="footer-social">
            <h4>Follow Us</h4>
            {store?.social?.instagram && <a href={store.social.instagram} target="_blank" rel="noreferrer">Instagram</a>}
            {store?.social?.facebook && <a href={store.social.facebook} target="_blank" rel="noreferrer">Facebook</a>}
            {store?.social?.twitter && <a href={store.social.twitter} target="_blank" rel="noreferrer">Twitter</a>}
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} {store?.storeName}. Built with WebG.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
