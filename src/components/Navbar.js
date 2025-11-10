// src/components/Sidebar.js
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom'; // Cambiamos Link por NavLink
import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/css/sidebar.css';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="sidebar d-flex flex-column justify-content-between">
      <div>
        <div className="sidebar-header text-center py-4">
          <h3 className="text-white fw-bold">🍕 Pizzería</h3>
        </div>
        <ul className="nav flex-column px-3">
          <li className="nav-item">
            <NavLink
              to="/admin"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              end // Importante para que solo coincida con /admin exactamente
            >
              Dashboard
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              to="/admin/pedidos"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              Pedidos
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              to="/admin/products"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              Productos
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              to="/admin/categories"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              Categories
            </NavLink>
          </li>
        </ul>
      </div>
      <div className="px-3 pb-4">
        <button 
          onClick={handleLogout}
          className="btn btn-danger w-100"
        >
          Cerrar Sesión
        </button>
      </div>
    </nav>
  );
};

export default Sidebar;