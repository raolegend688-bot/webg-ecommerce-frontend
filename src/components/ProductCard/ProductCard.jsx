import React from "react";
import { Link } from "react-router-dom";
import { useStore } from "../../context/StoreContext";
import "./ProductCard.css";

const ProductCard = ({ product }) => {
  const { addToCart } = useStore();

  const discount = product.comparePrice > product.price
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  return (
    <div className="product-card">
      {discount > 0 && <span className="badge-discount">{discount}% OFF</span>}
      {product.stock === 0 && <span className="badge-oos">Out of Stock</span>}

      <Link to={`/products/${product._id}`}>
        <div className="product-img-wrap">
          <img
            src={product.images?.[0] || "https://placehold.co/300x300?text=No+Image"}
            alt={product.name}
            className="product-img"
            loading="lazy"
          />
        </div>
      </Link>

      <div className="product-info">
        <span className="product-category">{product.category}</span>
        <Link to={`/products/${product._id}`} className="product-name">
          {product.name}
        </Link>

        <div className="product-pricing">
          <span className="price-current">₹{product.price.toLocaleString("en-IN")}</span>
          {product.comparePrice > product.price && (
            <span className="price-original">₹{product.comparePrice.toLocaleString("en-IN")}</span>
          )}
        </div>

        <button
          className="btn-add-cart"
          disabled={product.stock === 0}
          onClick={() => addToCart(product)}
        >
          {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
