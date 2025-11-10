import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Admin imports
import AdminHome from './pages/admin/Home';
import AdminPedidos from './pages/admin/Orders';
import AdminProducts from './pages/admin/Products';
import Categories from './pages/admin/Categories';
import Carts from './pages/admin/Carts';
import AdminLayout from './components/AdminLayout';

// Client/Store imports
import StoreHome from './pages/client/Index';
import ProductDetail from './pages/client/ProductDetail';
import Menu from './pages/client/Menu';
import Checkout from './pages/checkout/Checkout';
import PedidosUsuario from './pages/PedidosUsuario';

// Auth imports
import Login from './pages/Login';
import Register from './pages/Register';
import AuthForm from './pages/client/AuthForm';
import RegistroUsuarios from './pages/RegistroUsuarios';

// Public Pages
import SobreNosotros from './pages/SobreNosotros';
import Unauthorized from './pages/Unauthorized';

// Components and Providers
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/checkout/Layout';
import { AuthProvider } from './context/AuthContext';

const renderWithLayout = (children, layoutProps = {}) => (
  <Layout {...layoutProps}>{children}</Layout>
);

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        {/* ============= RUTAS DE AUTENTICACIÓN (SIN LAYOUT) ============= */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/auth" element={<AuthForm />} />
        <Route path="/Registro" element={<RegistroUsuarios />} />

        {/* ============= RUTAS PÚBLICAS DE LA TIENDA (CON LAYOUT Y PADDING) ============= */}
        <Route
          path="/"
          element={renderWithLayout(<StoreHome />, { withNavbarPadding: true })}
        />
        <Route
          path="/tienda"
          element={renderWithLayout(<StoreHome />, { withNavbarPadding: false })}
        />
        <Route
          path="/menu"
          element={renderWithLayout(<Menu />, { withNavbarPadding: true, navbarSolid: true })}
        />
        <Route
          path="/about"
          element={renderWithLayout(<SobreNosotros />, { withNavbarPadding: true, navbarSolid: true })}
        />
        <Route
          path="/checkout"
          element={renderWithLayout(<Checkout />, { withNavbarPadding: true, navbarSolid: true })}
        />
        <Route
          path="/pedidosUsuario"
          element={renderWithLayout(<PedidosUsuario />, { withNavbarPadding: true, navbarSolid: true })}
        />
        <Route
          path="/unauthorized"
          element={renderWithLayout(<Unauthorized />, { withNavbarPadding: true, navbarSolid: true })}
        />

        {/* ============= PRODUCT DETAIL (SIN PADDING) ============= */}
        <Route
          path="/producto/:id"
          element={renderWithLayout(<ProductDetail />, { withNavbarPadding: false })}
        />

        {/* Rutas Admin agrupadas */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole={['ROLE_ADMIN', 'ROLE_SELLER']}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminHome />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="categories" element={<Categories />} />
          <Route path="carts" element={<Carts />} />
          <Route path="pedidos" element={<AdminPedidos />} />
        </Route>

        {/* ============= RUTA DE FALLBACK ============= */}
        <Route path="*" element={<Navigate to="/tienda" replace />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;
