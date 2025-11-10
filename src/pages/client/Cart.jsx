import React from 'react';
import '../../assets/css/cart.css';

const Cart = ({
  isOpen,
  toggleCart,
  handleOutsideClick,
  cartItems = [],
  handleRemove,
  handleDecrease,
  handleAdd,
  totalPrice,
  isLoading,
  error
}) => {
  const safeCartItems = Array.isArray(cartItems) ? cartItems : [];

  return (
    <div
      className={`cart-overlay ${isOpen ? 'open' : ''}`}
      onClick={handleOutsideClick}
    >
      <div
        className={`cart-container ${isOpen ? 'open' : ''}`}
        onClick={e => e.stopPropagation()}
      >
        <div className="cart-header">
          <h2 className="cart-title">Tu Carrito</h2>
          <button className="cart-close-button" onClick={toggleCart}>
            ×
          </button>
        </div>

        <div className="cart-body">
          {isLoading && (
            <div className="cart-loading">
              <p>Cargando...</p>
            </div>
          )}

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          {!isLoading && !error && safeCartItems.length === 0 ? (
            <p>El carrito está vacío.</p>
          ) : (
            safeCartItems.map(item => (
              <div className="cart-item" key={item.productId}>
                <div className="cart-item-image">
                  {item.image && <img src={item.image} alt={item.productName} />}
                </div>
                <div className="cart-item-details">
                  <h6>{item.productName}</h6>
                  <p>Precio: ${item.specialPrice ?? item.price}</p>
                  <p>Cantidad: {item.quantity}</p>
                  <p>Subtotal: ${item.quantity * (item.specialPrice ?? item.price)}</p>
                </div>
                <div className="cart-item-actions">
                  <button
                    onClick={() => handleDecrease(item.productId)}
                    disabled={isLoading || item.quantity <= 1}
                  >
                    -
                  </button>
                  <button
                    onClick={() => handleAdd(item.productId)}
                    disabled={isLoading}
                  >
                    +
                  </button>
                  <button
                    onClick={() => handleRemove(item.productId)}
                    disabled={isLoading}
                  >
                    ×
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="cart-footer">
          <strong>Total: ${totalPrice}</strong>
        </div>
      </div>
    </div>
  );
};

export default Cart;
