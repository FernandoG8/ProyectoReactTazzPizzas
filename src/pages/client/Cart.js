import React, { useCallback, useEffect, useState } from 'react';
import Cart from './Cart.jsx';
import { CART_EVENTS, useCart } from '../../hooks/useCart';

const CartContainer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    items,
    totalPrice,
    loading,
    error,
    fetchCart,
    removeItem,
    decreaseItem,
    increaseItem
  } = useCart();

  useEffect(() => {
    if (!isOpen) return;
    fetchCart().catch(() => null);
  }, [fetchCart, isOpen]);

  useEffect(() => {
    const handleToggleCart = () => setIsOpen(prev => !prev);
    const handleCartUpdate = () => {
      if (isOpen) {
        fetchCart().catch(() => null);
      }
    };

    window.addEventListener(CART_EVENTS.toggle, handleToggleCart);
    window.addEventListener(CART_EVENTS.updated, handleCartUpdate);

    return () => {
      window.removeEventListener(CART_EVENTS.toggle, handleToggleCart);
      window.removeEventListener(CART_EVENTS.updated, handleCartUpdate);
    };
  }, [fetchCart, isOpen]);

  const toggleCart = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const handleOutsideClick = useCallback((event) => {
    if (event.target.classList.contains('cart-overlay')) {
      toggleCart();
    }
  }, [toggleCart]);

  return (
    <Cart
      isOpen={isOpen}
      toggleCart={toggleCart}
      handleOutsideClick={handleOutsideClick}
      cartItems={items}
      handleRemove={removeItem}
      handleDecrease={decreaseItem}
      handleAdd={increaseItem}
      totalPrice={totalPrice}
      isLoading={loading}
      error={error}
    />
  );
};

export default CartContainer;
