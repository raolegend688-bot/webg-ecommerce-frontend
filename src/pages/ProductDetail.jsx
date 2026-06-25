import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import { getProduct } from "../utils/api";
import { toast } from "react-toastify";
import "./ProductDetail.css";

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useStore();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImg, setSelectedImg] = useState(0);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    getProduct(id)
      .then(({ data }) => { setProduct(data); setSelectedImg(0); })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="detail-loading">Loading...</div>;
  if (!product) return <div className="detail-loading">Product not found. <Link to="/products">Go back</Link></div>;

  const discount = product.comparePrice > product.price
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  const handleAddToCart = () => {
    addToCart(product, qty);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="detail-page">
      <div className="detail-inner">
        {/* ── Images ──────────────────────────────────── */}
        <div className="detail-gallery">
          <div className="detail-main-img">
            <img
              src={product.images?.[selectedImg] || "https://placehold.co/600x600?text=No+Image"}
              alt={product.name}
            />
            {discount > 0 && <span className="detail-badge">{discount}% OFF</span>}
          </div>
          {product.images?.length > 1 && (
            <div className="detail-thumbs">
              {product.images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`${product.name} ${i + 1}`}
                  className={selectedImg === i ? "active" : ""}
                  onClick={() => setSelectedImg(i)}
                />
              ))}
            </div>
          )}
        </div>

        {/* ── Info ────────────────────────────────────── */}
        <div className="detail-info">
          <span className="detail-category">{product.category}</span>
          <h1 className="detail-name">{product.name}</h1>

          <div className="detail-pricing">
            <span className="detail-price">₹{product.price.toLocaleString("en-IN")}</span>
            {product.comparePrice > product.price && (
              <>
                <span className="detail-compare">₹{product.comparePrice.toLocaleString("en-IN")}</span>
                <span className="detail-save">Save ₹{(product.comparePrice - product.price).toLocaleString("en-IN")}</span>
              </>
            )}
          </div>

          <div className="detail-stock">
            {product.stock > 10
              ? <span className="in-stock">✅ In Stock</span>
              : product.stock > 0
              ? <span className="low-stock">⚠️ Only {product.stock} left</span>
              : <span className="out-stock">❌ Out of Stock</span>}
          </div>

          {product.description && (
            <p className="detail-desc">{product.description}</p>
          )}

          {/* Qty + Add to Cart */}
          <div className="detail-actions">
            <div className="qty-control">
              <button onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
              <span>{qty}</span>
              <button onClick={() => setQty(Math.min(product.stock, qty + 1))}>+</button>
            </div>
            <button
              className="btn-detail-cart"
              disabled={product.stock === 0}
              onClick={handleAddToCart}
            >
              {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
            </button>
            <Link to="/cart" className="btn-detail-buy">Buy Now →</Link>
          </div>

          {product.tags?.length > 0 && (
            <div className="detail-tags">
              {product.tags.map((tag) => <span key={tag} className="tag">#{tag}</span>)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
