import React, { useState, useEffect } from "react";
import api from "../../services/api"; // Usa tu instancia centralizada de axios
import "../../assets/css/cart.css";
import Cart from "./Cart.jsx";

const CartContainer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [cartId, setCartId] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch the current user's cart
  const fetchCart = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/carts/users/cart");
      const data = response.data;
      setCartId(data.cartId);
      setCartItems(data.products || []);
      setTotalPrice(data.totalPrice ?? 0);
    } catch (error) {
      console.error("Error fetching cart:", error);
      setCartItems([]);
      setTotalPrice(0);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) fetchCart();
    // eslint-disable-next-line
  }, [isOpen]);

  // Listen for global cart toggle and updates
  useEffect(() => {
    const handleToggleCart = () => setIsOpen(prev => !prev);
    const handleCartUpdate = () => {
      if (isOpen) fetchCart();
    };

    window.addEventListener("toggleCart", handleToggleCart);
    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => {
      window.removeEventListener("toggleCart", handleToggleCart);
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
    // eslint-disable-next-line
  }, [isOpen]);

  const toggleCart = () => setIsOpen(prev => !prev);
  const handleOutsideClick = e =>
    e.target.classList.contains("cart-overlay") && toggleCart();

  // Generic method to call cart mutate endpoints and refresh state
  const mutateCart = async (method, url) => {
    setIsLoading(true);
    try {
      await api({
        method,
        url,
      });
      // After mutation, re-fetch the cart so UI updates
      await fetchCart();
    } catch (err) {
      console.error(`Error mutating cart with ${method} on ${url}:`, err.response || err);
      alert("Error al actualizar el carrito. Por favor, inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  // Remove entire product from cart
  const handleRemove = async productId => {
    if (!cartId || isLoading) return;
    await mutateCart(
      "delete",
      `/carts/${cartId}/product/${productId}`
    );
  };

  // Decrease quantity by 1
  const handleDecrease = async productId => {
    if (!cartId || isLoading) return;
    await mutateCart(
      "put",
      `/cart/products/${productId}/quantity/delete`
    );
  };

  // Increase quantity by 1
  const handleAdd = async productId => {
    if (!cartId || isLoading) return;
    await mutateCart(
      "put",
      `/cart/products/${productId}/quantity/add`
    );
  };

  return (
    <Cart
      isOpen={isOpen}
      toggleCart={toggleCart}
      handleOutsideClick={handleOutsideClick}
      cartItems={cartItems}
      handleRemove={handleRemove}
      handleDecrease={handleDecrease}
      handleAdd={handleAdd}
      totalPrice={totalPrice}
      isLoading={isLoading}
    />
  );
};

export default CartContainer;