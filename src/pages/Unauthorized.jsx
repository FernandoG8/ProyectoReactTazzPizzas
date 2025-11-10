import React from 'react';
import { Link } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-sm border-0">
            <div className="card-body text-center py-5">
              <div className="mb-4">
                <i className="bi bi-shield-lock text-warning" style={{ fontSize: '3rem' }}></i>
              </div>
              <h2 className="mb-3">Acceso restringido</h2>
              <p className="text-muted">
                No cuentas con los permisos necesarios para acceder a esta sección.
              </p>
              <p className="text-muted mb-4">
                Si crees que se trata de un error, por favor contacta al administrador del sistema.
              </p>
              <Link to="/tienda" className="btn btn-primary">
                Volver a la tienda
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
