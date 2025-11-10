import React from 'react';
import '../assets/css/PedidosUsuario.css';

const PedidosUsuarioEsqueleto = () => (
  <div className="pedidos-container">
    <h2>Mis Pedidos</h2>
    {[1, 2, 3].map((key) => (
      <div key={key} className="pedido-card shimmer">
        <div className="pedido-header">
          <span className="shimmer-line short"></span>
          <span className="shimmer-line short"></span>
        </div>
        <ul className="pedido-items">
          {[1, 2].map((i) => (
            <li key={i} className="pedido-item">
              <span className="shimmer-line medium"></span>
              <span className="shimmer-line small"></span>
            </li>
          ))}
        </ul>
        <div className="pedido-footer">
          <span className="shimmer-line short"></span>
          <span className="shimmer-line short"></span>
        </div>
      </div>
    ))}
  </div>
);

export default PedidosUsuarioEsqueleto;