import React, { useState } from 'react';
import '../../assets/css/Checkout.css'; // Estilos para un diseño limpio y moderno

const Checkout = () => {
  const [cartSummary, setCartSummary] = useState([]);
  const [shippingMethod, setShippingMethod] = useState('');
  const [voucher, setVoucher] = useState('');
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleShippingChange = (method) => {
    setShippingMethod(method);
  };

  const handleVoucherChange = (e) => {
    setVoucher(e.target.value);
  };

  return (
    <div className="checkout-container">
      <div className="checkout-header">
        <h1>Checkout</h1>
        <p>Completa tu orden</p>
      </div>

      <div className="checkout-main">
        <div className="checkout-card">
          <h2 className="checkout-section-title">1. Envio</h2>
          <div className="checkout-form">
            <input
              type="text"
              name="name"
              placeholder="Nombre completo"
              value={userInfo.name}
              onChange={handleInputChange}
            />
            <input
              type="email"
              name="email"
              placeholder="Correo"
              value={userInfo.email}
              onChange={handleInputChange}
            />
            <input
              type="tel"
              name="phone"
              placeholder="Telefono"
              value={userInfo.phone}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="address"
              placeholder="Direccion"
              value={userInfo.address}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="checkout-card">
          <h2 className="checkout-section-title">2. Metodo de envio</h2>
          <div className="shipping-methods">
            <label>
              <input
                type="radio"
                value="standard"
                checked={shippingMethod === 'standard'}
                onChange={() => handleShippingChange('standard')}
              />
              Envio normal
            </label>
            <label>
              <input
                type="radio"
                value="express"
                checked={shippingMethod === 'express'}
                onChange={() => handleShippingChange('express')}
              />
              Didi
            </label>
            <label>
              <input
                type="radio"
                value="nextDay"
                checked={shippingMethod === 'nextDay'}
                onChange={() => handleShippingChange('nextDay')}
              />
              Recoger en lugar
            </label>
          </div>
        </div>

        <div className="checkout-card">
          <h2 className="checkout-section-title">3. Aplicar cupon</h2>
          <div className="voucher-section">
            <input
              type="text"
              placeholder="Enter voucher code"
              value={voucher}
              onChange={handleVoucherChange}
            />
            <button className="voucher-btn">Aplicar</button>
          </div>
        </div>

        <div className="checkout-card summary-card">
          <h2 className="checkout-section-title">4. Resumen</h2>
          <div className="order-summary">
            <p><strong>Carrito:</strong> {cartSummary.length}</p>
            <p><strong>Envio:</strong> {shippingMethod || 'Not Selected'}</p>
            <p><strong>Total:</strong> ${cartSummary.reduce((total, item) => total + item.price, 0)}</p>
          </div>
          <button className="checkout-btn">Pagar</button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
