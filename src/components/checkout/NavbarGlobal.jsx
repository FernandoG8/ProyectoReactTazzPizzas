// src/components/NavbarGlobal.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; 
import { NavLink, useNavigate } from 'react-router-dom'; 
const NavbarGlobal = ({ solid = false }) => {
  const { isLoggedIn, user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!solid) {
      const onScroll = () => setScrolled(window.scrollY > 10);
      window.addEventListener("scroll", onScroll);
      return () => window.removeEventListener("scroll", onScroll);
    }
  }, [solid]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };


  // Decide la clase del navbar según la prop y el scroll
  let navbarClass = "navbar navbar-expand-lg fixed-top ";
  if (solid) {
    navbarClass += "navbar-scrolled"; // Siempre negro
  } else {
    navbarClass += scrolled ? "navbar-scrolled" : "navbar-transparent";
  }

  return (
    <nav className={navbarClass}>
      <div className="container">
        <Link className="navbar-brand" to="/" data-aos="fade-right">
          <span className="logo-text">Tazz</span>
          <span className="logo-pizza">Pizza</span>
          <span className="logo-icon">🍕</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item" data-aos="fade-down" data-aos-delay="100">
              <Link className="nav-link" to="/menu">
                <span className="nav-icon">🍽️</span> Menú
              </Link>
            </li>
            <li className="nav-item" data-aos="fade-down" data-aos-delay="200">
              <Link className="nav-link" to="/about">
                <span className="nav-icon">👨‍🍳</span> Sobre Nosotros
              </Link>
            </li>
            <li className="nav-item" data-aos="fade-down" data-aos-delay="200">
              <Link className="nav-link" to="/checkout">
                <span className="nav-icon"> 🛒 </span> Ir a pagar
              </Link>
            </li>
           
            <li className="nav-item" data-aos="fade-down" data-aos-delay="200">
              <Link className="nav-link" to="/pedidosUsuario">
                <span className="nav-icon"> 🚚 </span> Mis Pedidos
              </Link>
            </li>
          </ul>

          <div className="d-flex align-items-center" data-aos="fade-left">
            {isLoggedIn ? (
              <>
                <span className="text-white me-3">
                  👋 Hola, {user?.username}
                </span>
                <button onClick={handleLogout} className="btn btn-warning">
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/Registro"
                  className="btn btn-outline-light me-2 register-btn"
                >
                  Registrarse
                </Link>
                <Link to="/login" className="btn btn-danger login-btn">
                  Iniciar Sesión
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavbarGlobal;
