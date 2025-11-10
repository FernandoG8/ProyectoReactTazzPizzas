// PedidosUsuario.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PedidosUsuarioEsqueleto from './PedidosUsuarioEsqueleto';
import '../assets/css/PedidosUsuario.css';

const PedidosUsuario = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPedidos = async () => {
      setLoading(true);
      setError(null);
      try {
        // Llamada GET para obtener todos los pedidos del usuario autenticado usando cookie
        const response = await axios.get(
          'http://localhost:8080/api/user/orders',
          { withCredentials: true }
        );

        console.log('Pedidos recibidos:', response.data);
        // Normalizar siempre a array
        const items = Array.isArray(response.data)
          ? response.data
          : [response.data];
        setPedidos(items);
      } catch (err) {
        console.error('Error al cargar pedidos:', err);
        if (err.response?.status === 401) {
          setError('No autorizado. Por favor inicia sesión para ver tus pedidos.');
        } else {
          setError('Error al cargar los pedidos. Intenta de nuevo más tarde.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPedidos();
  }, []);

  if (loading) return <PedidosUsuarioEsqueleto />;
  if (error) return <div className="pedidos-error">{error}</div>;

  return (
    <div className="pedidos-container">
      <h2>Mis Pedidos</h2>
      {pedidos.length === 0 ? (
        <p>No tienes pedidos registrados.</p>
      ) : (
        pedidos.map((order) => (
          <div key={order.orderId} className="pedido-card">
            <div className="pedido-header">
              <span>Pedido #{order.orderId}</span>
              <span>{new Date(order.orderDate).toLocaleDateString()}</span>
            </div>
            <ul className="pedido-items">
              {order.orderItems.map((item) => (
                <li key={item.orderItemId} className="pedido-item">
                  <span>{item.product.productName} x{item.quantity}</span>
                  <span>${item.orderedProductPrice}</span>
                </li>
              ))}
            </ul>
            <div className="pedido-footer">
              <span>Total: ${order.totalAmount}</span>
              <span>Método: {order.payment.pgName}</span>
              <span>Estado Pago: {order.payment.pgStatus}</span>
              <span>Estado Pedido: {order.orderStatus}</span>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default PedidosUsuario;
