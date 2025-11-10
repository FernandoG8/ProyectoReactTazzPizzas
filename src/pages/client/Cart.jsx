import React, { useState } from "react";
import "../../assets/css/cart.css";

const Cart = ({
  isOpen,
  toggleCart,
  handleOutsideClick,
  cartItems,
  handleRemove,
  handleDecrease,
  handleAdd,
  totalPrice,
  isLoading,
  debugRequest,
}) => {
  const safeCartItems = cartItems || [];
  const [debugInfo, setDebugInfo] = useState("");
  const [showDebug, setShowDebug] = useState(false);

  // Función para agregar un item (con manejo de errores)
  const safeHandleAdd = async (productId) => {
    try {
      // Registrar información de depuración
      console.log("Intentando agregar producto:", productId);
      setDebugInfo("Procesando solicitud...");
      
      // Llamar a la función original
      await handleAdd(productId);
      
      setDebugInfo(`Producto ${productId} agregado correctamente`);
    } catch (error) {
      console.error("Error al agregar producto:", error);
      setDebugInfo(`Error al agregar: ${error.message}`);
    }
  };

  // Función para decrementar un item (con manejo de errores)
  const safeHandleDecrease = async (productId) => {
    try {
      // Registrar información de depuración
      console.log("Intentando disminuir producto:", productId);
      setDebugInfo("Procesando solicitud...");
      
      // Llamar a la función original
      await handleDecrease(productId);
      
      setDebugInfo(`Producto ${productId} disminuido correctamente`);
    } catch (error) {
      console.error("Error al disminuir producto:", error);
      setDebugInfo(`Error al disminuir: ${error.message}`);
    }
  };

  // Función para probar directamente los endpoints
  const testEndpoints = async (productId) => {
    setDebugInfo("Probando endpoints...");
    
    try {
      // Probar endpoint de agregar
      const addResponse = await debugRequest(`http://localhost:8080/api/cart/products/${productId}/quantity/add`);
      
      // Probar endpoint de disminuir
      const deleteResponse = await debugRequest(`http://localhost:8080/api/cart/products/${productId}/quantity/delete`);
      
      setDebugInfo(`
        Resultados:
        Agregar: ${addResponse ? "OK" : "Error"}
        Disminuir: ${deleteResponse ? "OK" : "Error"}
      `);
    } catch (error) {
      setDebugInfo(`Error en prueba: ${error.message}`);
    }
  };

  return (
    <div
      className={`cart-overlay ${isOpen ? "open" : ""}`}
      onClick={handleOutsideClick}
    >
      <div
        className={`cart-container ${isOpen ? "open" : ""}`}
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
          
          {!isLoading && safeCartItems.length === 0 ? (
            <p>El carrito está vacío.</p>
          ) : (
            <>
              {safeCartItems.map(item => (
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
                      onClick={() => safeHandleDecrease(item.productId)} 
                      disabled={isLoading || item.quantity <= 1}
                    >
                      -
                    </button>
                    <button 
                      onClick={() => safeHandleAdd(item.productId)}
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
                    {showDebug && (
                      <button 
                        onClick={() => testEndpoints(item.productId)}
                        className="debug-button"
                      >
                        Test
                      </button>
                    )}
                  </div>
                </div>
              ))}
              
            </>
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