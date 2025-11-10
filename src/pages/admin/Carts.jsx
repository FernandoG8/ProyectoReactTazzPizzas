import React, { useEffect, useState, useCallback } from 'react';
import api from '../../services/api';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../../assets/css/product.css';

const Carts = () => {
  const [carts, setCarts] = useState([]);
  const [filteredCarts, setFilteredCarts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const fetchCarts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setCarts([]);
      setFilteredCarts([]);

      const response = await api.get('/carts', {
        validateStatus: function (status) {
          return status === 200 || status === 302;
        }
      });
      
      const responseData = Array.isArray(response.data) ? response.data : 
                         (response.data?.content || []);
      
      setCarts(responseData);
      setFilteredCarts(responseData);
    } catch (error) {
      console.error('Error fetching carts:', error);
      setError('Failed to fetch carts. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCarts();
  }, [fetchCarts]);

  useEffect(() => {
    if (searchTerm === '') {
      setFilteredCarts(carts);
    } else {
      const filtered = carts.filter(cart => 
        cart.cartId?.toString().includes(searchTerm.toLowerCase()) ||
        cart.totalPrice?.toString().includes(searchTerm.toLowerCase()) ||
        (cart.products && cart.products.some(product => 
          product.productName?.toLowerCase().includes(searchTerm.toLowerCase())
        ))
      );
      setFilteredCarts(filtered);
    }
  }, [searchTerm, carts]);

  if (loading) {
    return <div className="p-4">Loading carts...</div>;
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
      <h1 className="text-center mb-4" data-aos="fade-up">Shopping Carts</h1>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex">
          <input
            type="text"
            className="form-control me-2"
            placeholder="Search cart..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="table-responsive" data-aos="fade-up">
        <table className="table table-striped table-bordered shadow-sm">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Total Price</th>
              <th>Products</th>
              <th>Total Quantity</th>
            </tr>
          </thead>
          <tbody>
            {filteredCarts.length > 0 ? (
              filteredCarts.map(cart => (
                <tr key={cart.cartId}>
                  <td>{cart.cartId}</td>
                  <td>${cart.totalPrice?.toFixed(2) || '0.00'}</td>
                  <td>
                    <ul className="list-unstyled">
                      {cart.products?.length > 0 ? (
                        cart.products.map(product => (
                          <li key={product.productId}>
                            {product.productName} (${product.price?.toFixed(2) || '0.00'}) x {product.quantity}
                          </li>
                        ))
                      ) : (
                        <li className="text-muted">No products</li>
                      )}
                    </ul>
                  </td>
                  <td>
                    {cart.products?.reduce((total, product) => total + (product.quantity || 0), 0) || 0}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center text-muted">
                  {searchTerm ? "No carts found." : "No carts available."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Carts;