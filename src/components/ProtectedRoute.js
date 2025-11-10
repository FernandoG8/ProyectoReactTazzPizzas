// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isLoggedIn, user, loading } = useAuth();
  const location = useLocation();

  console.log('ProtectedRoute - Estado completo:', {
    isLoggedIn,
    user,
    loading,
    requiredRole,
    currentPath: location.pathname,
    userRoles: user?.roles
  });

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!isLoggedIn) {
    console.log('No autenticado - Redirigiendo a login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const userRoles = user?.roles || [];
  const hasRequiredRole = requiredRole.some(role => userRoles.includes(role));

  console.log('Verificación de roles:', {
    userRoles,
    requiredRole,
    hasRequiredRole
  });

  if (!hasRequiredRole) {
    console.log('Sin rol requerido - Redirigiendo a unauthorized');
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;