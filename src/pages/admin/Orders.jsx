import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import FeedbackModal from '../../components/modals/FeedbackModal';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../../assets/css/product.css';

const Pedidos = () => {
  // Estados principales
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addresses, setAddresses] = useState({});
  const [feedback, setFeedback] = useState({ show: false, message: '', type: 'success' });

  // Funciones auxiliares
  const showFeedback = (message, type = 'success') => {
    setFeedback({ show: true, message, type });
    setTimeout(() => setFeedback({ show: false, message: '', type: 'success' }), 3000);
  };

  const fetchAddress = async (addressId) => {
    try {
      if (!addresses[addressId]) {
        const response = await api.get(`/addresses/${addressId}`);
        setAddresses(prev => ({
          ...prev,
          [addressId]: response.data
        }));
      }
    } catch (error) {
      console.error(`Error fetching address ${addressId}:`, error);
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get(`/admin/orders`);
      const fetchedOrders = response.data || []; // Changed from response.data.content to response.data

      setOrders(fetchedOrders);

      // Prefetch addresses for all orders
      fetchedOrders.forEach(order => {
        if (order.addressId) {
          fetchAddress(order.addressId);
        }
      });
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError(error.response?.data?.message || 'Error al cargar los pedidos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    AOS.init({ duration: 1000 });
    fetchOrders();
  }, []); // Empty dependency array to run only once on mount

  const handlePaymentStatusChange = async (orderId, status) => {
    let payload = {};
    switch (status) {
      case 'succeeded':
        payload = {
          pgStatus: 'succeeded',
          pgResponseMessage: 'Pago completado'
        };
        break;
      case 'cancelled':
        payload = {
          pgStatus: 'cancelled',
          pgResponseMessage: 'Pago cancelado'
        };
        break;
      case 'pending':
        payload = {
          pgStatus: 'pending',
          pgResponseMessage: 'Pago pendiente'
        };
        break;
      default:
        return;
    }

    try {
      await api.put(`/admin/order/${orderId}/payment-status`, payload);
      fetchOrders();
      showFeedback('Estado de pago actualizado correctamente.');
    } catch (err) {
      showFeedback('Error al actualizar el estado de pago.', 'error');
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'succeeded':
        return 'success';
      case 'cancelled':
        return 'danger';
      case 'pending':
        return 'warning';
      default:
        return 'secondary';
    }
  };

  if (loading) return <div className="p-4">Cargando pedidos...</div>;
  if (error) return <div className="p-4"><div className="alert alert-danger">{error}</div></div>;

  return (
    <div className="p-4">
      <h1 className="text-center mb-4" data-aos="fade-up">Pedidos</h1>

      <div className="table-responsive" data-aos="fade-up">
        <table className="table table-striped table-bordered shadow-sm">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Productos</th>
              <th>Fecha de orden</th>
              <th>Domicilio</th>
              <th>Método de pago</th>
              <th>Estado de pago</th>
              <th>Estado de orden</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map(order => (
                <tr key={order.orderId}>
                  <td>{order.orderId}</td>
                  <td>
                    <ul className="list-unstyled mb-0">
                      {order.orderItems.map(item => (
                        <li key={item.orderItemId}>
                          {item.quantity}x {item.product.productName} (${item.orderedProductPrice.toFixed(2)})
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td>{order.orderDate}</td>
                  <td>
                    {addresses[order.addressId] ? (
                      `${addresses[order.addressId].street}, ${addresses[order.addressId].city}`
                    ) : (
                      'Cargando...'
                    )}
                  </td>
                  <td>
                    {order.payment.paymentMethod === 'CASH' ? (
                      'EFECTIVO'
                    ) : (
                      `${order.payment.paymentMethod} via ${order.payment.pgName}`
                    )}
                  </td>
                  <td>
                    {order.payment.paymentMethod === 'CASH' ? (
                      <select
                        className={`form-select form-select-sm bg-${getStatusColor(order.payment.pgStatus)} text-white`}
                        value={order.payment.pgStatus}
                        onChange={(e) => handlePaymentStatusChange(order.orderId, e.target.value)}
                      >
                        <option value="succeeded" className="text-dark">Completado</option>
                        <option value="cancelled" className="text-dark">Cancelado</option>
                        <option value="pending" className="text-dark">Pendiente</option>
                      </select>
                    ) : (
                      <span className={`badge bg-${getStatusColor(order.payment.pgStatus)} text-white`}>
                        {order.payment.pgStatus}
                      </span>
                    )}
                  </td>
                  <td>
                    <span className="badge bg-info">
                      {order.orderStatus}
                    </span>
                  </td>
                  <td>${order.totalAmount.toFixed(2)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center text-muted">
                  No hay pedidos registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <FeedbackModal
        show={feedback.show}
        message={feedback.message}
        type={feedback.type}
        onClose={() => setFeedback({ show: false, message: '', type: 'success' })}
      />
    </div>
  );
};

export default Pedidos;