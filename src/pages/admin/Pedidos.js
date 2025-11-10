// src/pages/admin/Pedidos.jsx
import React, { useEffect, useState, useCallback } from 'react';
import api from '../../services/api';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../../assets/css/product.css';

const Pedidos = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [addressCache, setAddressCache] = useState({});

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const fetchAddress = async (addressId) => {
    try {
      const response = await api.get(`/addresses/${addressId}`);
      setAddressCache(prev => ({
        ...prev,
        [addressId]: response.data
      }));
    } catch (error) {
      console.error('Error fetching address:', error);
      setAddressCache(prev => ({
        ...prev,
        [addressId]: { street: 'Address not available' }
      }));
    }
  };

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get(`/admin/orders`);
      const fetchedOrders = response.data.content || [];
      
      setOrders(fetchedOrders);
      setTotalPages(response.data.totalPages || 1);
      console.log('Fetched orders:', fetchedOrders);
      // Pre-fetch addresses
      fetchedOrders.forEach(order => {
        if (order.addressId && !addressCache[order.addressId]) {
          fetchAddress(order.addressId);
        }
      });
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError(error.response?.data?.message || 'Error al cargar los pedidos');
    } finally {
      setLoading(false);
    }
  }, [page, addressCache]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Helper functions
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const formatOrderItems = (orderItems) => {
    if (!orderItems?.length) return 'No items';
    
    return (
      <ul className="list-unstyled mb-0">
        {orderItems.map(item => (
          <li key={item.orderItemId}>
            {item.product?.productName || 'Unknown product'} × {item.quantity}
          </li>
        ))}
      </ul>
    );
  };

  const formatPaymentMethod = (payment) => {
    if (!payment) return 'N/A';
    return `${payment.paymentMethod} (${payment.pgName})`;
  };

  const getAddressStreet = (addressId) => {
    if (!addressId) return 'N/A';
    return addressCache[addressId]?.street || 'Loading...';
  };

  if (loading) {
    return <div className="p-4">Loading orders...</div>;
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-center mb-4" data-aos="fade-up">Pedidos</h1>

      <div className="table-responsive" data-aos="fade-up">
        <table className="table table-striped table-bordered shadow-sm">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Products</th>
              <th>Order Date</th>
              <th>Payment Method</th>
              <th>Total Amount</th>
              <th>Order Status</th>
              <th>Address</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map(order => (
                <tr key={order.orderId}>
                  <td>{order.orderId}</td>
                  <td>{formatOrderItems(order.orderItems)}</td>
                  <td>{formatDate(order.orderDate)}</td>
                  <td>{formatPaymentMethod(order.payment)}</td>
                  <td>${order.totalAmount?.toFixed(2) || '0.00'}</td>
                  <td>{order.orderStatus || 'N/A'}</td>
                  <td>{getAddressStreet(order.addressId)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center text-muted">
                  No hay órdenes, date un descanso
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-3">
          <nav>
            <ul className="pagination">
              <li className={`page-item ${page === 0 ? 'disabled' : ''}`}>
                <button 
                  className="page-link" 
                  onClick={() => setPage(prev => Math.max(prev - 1, 0))}
                >
                  Anterior
                </button>
              </li>
              {[...Array(totalPages)].map((_, i) => (
                <li key={i} className={`page-item ${i === page ? 'active' : ''}`}>
                  <button 
                    className="page-link" 
                    onClick={() => setPage(i)}
                  >
                    {i + 1}
                  </button>
                </li>
              ))}
              <li className={`page-item ${page === totalPages - 1 ? 'disabled' : ''}`}>
                <button 
                  className="page-link" 
                  onClick={() => setPage(prev => Math.min(prev + 1, totalPages - 1))}
                >
                  Siguiente
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
};

export default Pedidos;