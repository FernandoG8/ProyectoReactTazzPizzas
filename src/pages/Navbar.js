import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";


const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    const role = localStorage.getItem("role");

    setIsLoggedIn(!!token);
    setIsAdmin(role === "ADMIN");
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("jwt_token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
    setIsAdmin(false);
    navigate("/login");
  };

  const toggleCart = () => {
    const event = new CustomEvent("toggleCart");
    window.dispatchEvent(event);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm sticky-top">
      <div className="container">
        <Link
          className="navbar-brand fw-bold"
          to="/tienda"
          style={{ fontFamily: "'Fredoka One', cursive" }}
        >
          TAZ PIZZA
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/">Inicio</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/menu">Menú</Link>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Promociones</a>
            </li>
            {isAdmin && (
              <li className="nav-item">
                <Link className="nav-link" to="/admin">Panel Admin</Link>
              </li>
            )}
            <li className="">
              <button
                className="bs-3"
                onClick={toggleCart}
              >
                🛒 Carr
              </button>
            </li>
            <li className="nav-item d-flex align-items-center">
              {isLoggedIn ? (
                <button
                  className="btn btn-outline-danger ms-3"
                  onClick={handleLogout}
                >
                  Cerrar Sesión
                </button>
              ) : (
                <>
                  <Link className="btn btn-outline-success ms-3" to="/login">
                    Iniciar Sesión
                  </Link>
                  <Link className="btn btn-primary ms-2" to="/register">
                    Registrarse
                  </Link>
                </>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
