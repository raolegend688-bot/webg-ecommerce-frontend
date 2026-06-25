import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import ProductCard from "../components/ProductCard/ProductCard";
import { getProducts } from "../utils/api";
import "./Products.css";

const Products = () => {
  const { store } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const category = searchParams.get("category") || "all";
  const search = searchParams.get("search") || "";
  const page = Number(searchParams.get("page")) || 1;

  const fetchProducts = useCallback(async () => {
    if (!store?._id) return;
    setLoading(true);
    try {
      const params = { storeId: store._id, page, limit: 12 };
      if (category !== "all") params.category = category;
      if (search) params.search = search;
      const { data } = await getProducts(params);
      setProducts(data.products);
      setTotal(data.total);
      setPages(data.pages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [store, category, search, page]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const setCategory = (cat) => {
    const p = new URLSearchParams();
    if (cat !== "all") p.set("category", cat);
    setSearchParams(p);
  };

  const goPage = (pg) => {
    const p = new URLSearchParams(searchParams);
    p.set("page", pg);
    setSearchParams(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="products-page">
      <div className="products-page-inner">
        {/* ── Sidebar Filters ─────────────────────────── */}
        <aside className="sidebar">
          <h3>Categories</h3>
          <ul className="cat-list">
            <li>
              <button className={category === "all" ? "active" : ""} onClick={() => setCategory("all")}>
                All Products <span>{total}</span>
              </button>
            </li>
            {store?.categories?.map((cat) => (
              <li key={cat}>
                <button className={category === cat ? "active" : ""} onClick={() => setCategory(cat)}>
                  {cat}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* ── Main Content ─────────────────────────────── */}
        <main className="products-main">
          <div className="products-topbar">
            <h2>
              {search ? `Results for "${search}"` : category === "all" ? "All Products" : category}
            </h2>
            <span className="result-count">{total} products</span>
          </div>

          {loading ? (
            <div className="products-grid">
              {[...Array(8)].map((_, i) => <div key={i} className="skeleton-card" />)}
            </div>
          ) : products.length === 0 ? (
            <div className="empty-state">
              <p>🔍 No products found</p>
              <button onClick={() => setSearchParams({})}>Clear filters</button>
            </div>
          ) : (
            <div className="products-grid">
              {products.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          )}

          {/* Pagination */}
          {pages > 1 && (
            <div className="pagination">
              {[...Array(pages)].map((_, i) => (
                <button
                  key={i}
                  className={page === i + 1 ? "active" : ""}
                  onClick={() => goPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Products;
