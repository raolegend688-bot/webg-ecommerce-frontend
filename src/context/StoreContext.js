import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { getStore } from "../utils/api";

const StoreContext = createContext();

export const StoreProvider = ({ children, storeSlug }) => {
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ── Cart State ────────────────────────────────────────────
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("webg_cart")) || [];
    } catch {
      return [];
    }
  });

  // Persist cart
  useEffect(() => {
    localStorage.setItem("webg_cart", JSON.stringify(cart));
  }, [cart]);

  // ── Load Store Config ─────────────────────────────────────
  const fetchStore = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await getStore(storeSlug);
      setStore(data);

      // Apply theme CSS variables dynamically
      const root = document.documentElement;
      root.style.setProperty("--primary", data.theme.primaryColor);
      root.style.setProperty("--accent", data.theme.accentColor);
      root.style.setProperty("--font", data.theme.fontFamily);
      document.title = data.storeName;
    } catch (err) {
      setError(err.response?.data?.message || "Store not found");
    } finally {
      setLoading(false);
    }
  }, [storeSlug]);

  useEffect(() => { fetchStore(); }, [fetchStore]);

  // ── Cart Helpers ──────────────────────────────────────────
  const addToCart = (product, qty = 1) => {
    setCart((prev) => {
      const exists = prev.find((i) => i._id === product._id);
      if (exists) {
        return prev.map((i) =>
          i._id === product._id ? { ...i, quantity: i.quantity + qty } : i
        );
      }
      return [...prev, { ...product, quantity: qty }];
    });
  };

  const removeFromCart = (productId) =>
    setCart((prev) => prev.filter((i) => i._id !== productId));

  const updateQty = (productId, qty) => {
    if (qty <= 0) return removeFromCart(productId);
    setCart((prev) => prev.map((i) => (i._id === productId ? { ...i, quantity: qty } : i)));
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <StoreContext.Provider
      value={{
        store, loading, error, fetchStore,
        cart, addToCart, removeFromCart, updateQty, clearCart,
        cartTotal, cartCount,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
