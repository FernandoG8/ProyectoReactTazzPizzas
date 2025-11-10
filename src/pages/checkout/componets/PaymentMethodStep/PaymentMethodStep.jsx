// PaymentMethodStep.jsx
import React from 'react';
import './PaymentMethodStep.css';
const PaymentMethodStep = ({ onSelectPaymentMethod, selectedMethod }) => {
  return (
    <div className="payment-method-container">
      <h3>Selecciona tu método de pago</h3>
      
      <div className="payment-methods">
        <div 
          className={`payment-method-card ${selectedMethod === 'CARD' ? 'selected' : ''}`}
          onClick={() => onSelectPaymentMethod('CARD')}
        >
          <div className="payment-method-icon">💳</div>
          <div className="payment-method-details">
            <h4>Tarjeta de Crédito/Débito</h4>
            <p>Paga de forma segura con tu tarjeta</p>
          </div>
          <div className="payment-method-check">
            {selectedMethod === 'CARD' && '✓'}
          </div>
        </div>

        <div 
          className={`payment-method-card ${selectedMethod === 'CASH' ? 'selected' : ''}`}
          onClick={() => onSelectPaymentMethod('CASH')}
        >
          <div className="payment-method-icon">💵</div>
          <div className="payment-method-details">
            <h4>Efectivo</h4>
            <p>Paga en efectivo al recibir tu pedido</p>
          </div>
          <div className="payment-method-check">
            {selectedMethod === 'CASH' && '✓'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodStep;