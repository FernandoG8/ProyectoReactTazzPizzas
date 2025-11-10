import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDispatch } from 'react-redux';
import '../assets/css/login.css';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, isLoggedIn } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  // Manejar redirección basada en roles
  const handleRedirection = (userData) => {
    const from = location.state?.from?.pathname;
    
    // Si el usuario intentaba acceder a una ruta específica y tiene los permisos necesarios
    if (from) {
      if (from.startsWith('/admin') && 
          (userData.roles.includes('ROLE_ADMIN') || userData.roles.includes('ROLE_SELLER'))) {
        navigate(from);
        return;
      }
      if (!from.startsWith('/admin')) {
        navigate(from);
        return;
      }
    }

    // Redirección por defecto basada en rol
    if (userData.roles.includes('ROLE_ADMIN') || userData.roles.includes('ROLE_SELLER')) {
      navigate('/admin');
    } else {
      navigate('/tienda');
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await login(username, password);
      
      if (!result.success) {
        setError(result.error || 'Credenciales inválidas');
        return;
      }

      // Manejar la redirección basada en el rol del usuario
      handleRedirection(result.data);
      
    } catch (err) {
      setError('Error al intentar iniciar sesión');
      console.error('Error en login:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isLoggedIn) {
      const storedRoles = JSON.parse(localStorage.getItem('userRoles') || '[]');
      handleRedirection({ roles: storedRoles });
    }
  }, [isLoggedIn]);

  return (
    <div className="login-container" data-aos="fade-up">
      <div className="login-box">
        <h2>Login</h2>
        {error && (
          <p className="error-message" role="alert">
            {error}
          </p>
        )}
        <form onSubmit={onSubmit}>
          <div className="input-group">
            <input
              type="text"
              placeholder="Nombre de usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
              required
              aria-label="Nombre de usuario"
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
              aria-label="Contraseña"
            />
          </div>
          <button 
            type="submit" 
            className="login-btn"
            disabled={isLoading}
          >
            {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </button>
        </form>
        <p className="signup-link">
          ¿No tienes cuenta? <Link to="/registro">Regístrate aquí</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;