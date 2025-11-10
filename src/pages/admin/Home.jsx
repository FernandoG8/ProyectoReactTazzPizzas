import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../../assets/css/home.css';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [dailyEarnings, setDailyEarnings] = useState(0);
  const [dailyOrderCount, setDailyOrderCount] = useState(0);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [pendingOrdersLoading, setPendingOrdersLoading] = useState(true);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      offset: 200,
    });

    const fetchData = async () => {
      try {
        // Hacer loading de productos
        const productsRes = await api.get(`/public/products?pageNumber=${currentPage}&pageSize=10`);

        // Manejar la respuesta de productos
        const productsData = productsRes.data.content || productsRes.data || [];

        // Filtrar productos con stock disponible
        const filteredProducts = productsData.filter(p => {
          const quantity = p.cantidad ?? p.quantity;
          return quantity != null && quantity > 0;
        });

        setProducts(filteredProducts);
        setTotalPages(productsRes.data.totalPages || 1);

        // Obtener ganancias del día
        const [ordersRes, addressesRes] = await Promise.all([
          api.get('/admin/orders'),
          api.get('/addresses')
        ]);

        const today = new Date();
        // Formateamos la fecha actual en el mismo formato que el API (YYYY-MM-DD)
        const todayFormatted = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

        // Calculate daily earnings (excluding cancelled orders)
        const { earnings, orderCount } = ordersRes.data.reduce((acc, order) => {
          const orderDate = order.orderDate;
          if (orderDate === todayFormatted && order.orderStatus !== 'Cancelada' && order.payment?.pgStatus !== 'cancelled') {
            acc.earnings += order.totalAmount || 0;
            acc.orderCount += 1;
          }
          return acc;
        }, { earnings: 0, orderCount: 0 });

        const pending = ordersRes.data.filter(order =>
          order.orderStatus !== 'Completada' &&
          order.orderStatus !== 'Cancelada' &&
          order.payment?.pgStatus !== 'cancelled'
        ).slice(0, 5); // Mostrar máximo 5 órdenes


        setPendingOrders(pending);
        setPendingOrdersLoading(false);
        setAddresses(addressesRes.data);
        setDailyEarnings(earnings);
        setDailyOrderCount(orderCount);
        console.log('Ganancias del día:', earnings);
        setLoading(false);
        setOrdersLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setLoading(false);
        setOrdersLoading(false);
      }
    };

    fetchData();
  }, [currentPage]);

  const getFullAddress = (addressId) => {
    const address = addresses.find(addr => addr.addressId === addressId);
    if (!address) return 'Dirección no encontrada';
    return `${address.street}, ${address.city}, ${address.state}`;
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Helper function to get product property safely
  const getProductProp = (product, propNames) => {
    for (const prop of propNames) {
      if (product[prop] !== undefined) return product[prop];
    }
    return '';
  };

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-center mb-5" data-aos="fade-up">Dashboard de Pizzería</h1>

      <div className="row">
        {/* Columna para Ganancias y Órdenes Pendientes */}
        <div className="col-lg-4 col-md-6 mb-4">
          {/* Ganancias del día Card */}
          <div className="card card-shadow mb-4" data-aos="fade-right">
            <div className="card-header bg-success text-white">
              <h4>Ganancias del Día</h4>
            </div>
            <div className="card-body text-center py-4">
              {ordersLoading ? (
                <div className="spinner-border text-success" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              ) : (
                <>
                  <h2 className="display-4 mb-3">${dailyEarnings.toFixed(2)}</h2>
                  <p className="text-muted mb-0">Total de ventas hoy:</p>
                  <p className="text-muted mt-2">
                    <i className="bi bi-receipt me-2"></i>
                    {dailyOrderCount} {dailyOrderCount === 1 ? 'orden' : 'órdenes'}
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Órdenes Pendientes Card */}
          <div className="card card-shadow" data-aos="fade-up">
            <div className="card-header bg-info text-white">
              <h4>Órdenes Pendientes</h4>
            </div>
            <div className="card-body p-0">
              {pendingOrdersLoading ? (
                <div className="text-center p-4">
                  <div className="spinner-border text-info" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : pendingOrders.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Orden ID</th>
                        <th>Domicilio</th>
                        <th>Productos</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingOrders.map(order => (
                        <tr key={order.orderId}>
                          <td>#{order.orderId}</td>
                          <td>
                            <small>{getFullAddress(order.addressId)}</small>
                          </td>
                          <td>{order.orderItems.length}</td>
                          <td>${order.totalAmount.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center text-muted p-4">
                  No hay órdenes pendientes
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Products Card */}
        <div className="col-lg-4 col-md-6 mb-4" data-aos="fade-left">
          <div className="card card-shadow">
            <div className="card-header bg-warning text-white">
              <h4>Productos Disponibles</h4>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Producto</th>
                      <th>Precio</th>
                      <th>Stock</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.length > 0 ? (
                      products.map(product => (
                        <tr key={product.productId}>
                          <td>{getProductProp(product, ['nombre', 'productName', 'name'])}</td>
                          <td>${parseFloat(getProductProp(product, ['precio', 'price'])).toFixed(2)}</td>
                          <td>{getProductProp(product, ['cantidad', 'quantity'])}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="text-center text-muted py-4">
                          En esta página no hay productos con stock disponible
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="d-flex justify-content-between align-items-center p-3 border-top">
                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 0}
                >
                  &laquo; Anterior
                </button>
                <span className="text-muted">
                  Página {currentPage + 1} de {totalPages}
                </span>
                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages - 1}
                >
                  Siguiente &raquo;
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;