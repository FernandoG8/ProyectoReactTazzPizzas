import { useCallback, useState } from 'react';
import api from '../services/api';

const toggleEventName = 'toggleCart';
const updatedEventName = 'cartUpdated';

export const CART_EVENTS = {
  toggle: toggleEventName,
  updated: updatedEventName
};

export const useCart = () => {
  const [cartId, setCartId] = useState(null);
  const [items, setItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCart = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get('/carts/users/cart');
      setCartId(data.cartId ?? null);
      setItems(data.products || []);
      setTotalPrice(data.totalPrice ?? 0);
      return data;
    } catch (err) {
      setItems([]);
      setTotalPrice(0);
      setError(err.response?.data?.message || 'No se pudo cargar el carrito');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const mutateCart = useCallback(
    async (method, url) => {
      setLoading(true);
      setError(null);
      try {
        await api({ method, url });
        await fetchCart();
      } catch (err) {
        setError(err.response?.data?.message || 'No se pudo actualizar el carrito');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchCart]
  );

  const removeItem = useCallback(
    async (productId) => {
      if (!cartId) return;
      await mutateCart('delete', `/carts/${cartId}/product/${productId}`);
    },
    [cartId, mutateCart]
  );

  const decreaseItem = useCallback(
    async (productId) => {
      if (!cartId) return;
      await mutateCart('put', `/cart/products/${productId}/quantity/delete`);
    },
    [cartId, mutateCart]
  );

  const increaseItem = useCallback(
    async (productId) => {
      if (!cartId) return;
      await mutateCart('put', `/cart/products/${productId}/quantity/add`);
    },
    [cartId, mutateCart]
  );

  return {
    cartId,
    items,
    totalPrice,
    loading,
    error,
    fetchCart,
    removeItem,
    decreaseItem,
    increaseItem
  };
};
