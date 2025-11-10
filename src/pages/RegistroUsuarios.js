import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import AOS from 'aos';
import 'aos/dist/aos.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/css/stylesRegistroUsuarios.css';

const RegistroUsuarios = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  // Inicializar AOS
  useEffect(() => {
    AOS.init({
      duration: 600,
      easing: 'ease-out-quad',
      once: true,
      offset: 50
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.nombre.trim()) newErrors.nombre = 'Nombre requerido';
    if (!emailRegex.test(formData.email)) newErrors.email = 'Email inválido';
    if (formData.password.length < 6) newErrors.password = 'Mínimo 6 caracteres';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // 1. Registrar usuario
      await api.post('/auth/signup', {
        username: formData.nombre,
        email: formData.email,
        password: formData.password
      });

      // 2. Mostrar animación de éxito inmediatamente
      setRegistrationSuccess(true);

      // 3. Esperar el tiempo mínimo de la animación (2 segundos)
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 4. Intentar login automático
      try {
        const loginResult = await login(formData.nombre, formData.password);

        // 5. Redirigir según rol
        const redirectPath = loginResult.data.roles.includes('ROLE_ADMIN')
          ? '/admin'
          : '/tienda';
        navigate(redirectPath);

      } catch (loginError) {
        // 6. Si falla el login, redirigir igual
        navigate('/login');
      }

    } catch (error) {
      console.error('Error al registrar:', error);
      const errorMessage = error.response?.data?.message || 'Error al registrar. Intenta nuevamente.';

      if (errorMessage.includes('Username is already taken')) {
        setErrors({ nombre: 'Este nombre de usuario ya está en uso' });
      } else if (errorMessage.includes('Email is already in use')) {
        setErrors({ email: 'Este correo electrónico ya está registrado' });
      } else {
        setErrors({ submit: errorMessage });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="registro-wrapper">
      <div className="registro-card" data-aos="zoom-in">
        <div className="registro-header">
          <div className="pizza-icon" data-aos="fade-down" data-aos-delay="100">
            🍕
          </div>
          <h2 data-aos="fade-down" data-aos-delay="150">Crear Cuenta</h2>
          <p data-aos="fade-down" data-aos-delay="200">
            Únete a la familia TazzPizza <br />y recibe grandes Descuentos %
          </p>
        </div>

        {registrationSuccess ? (
          <div className="registro-success" data-aos="fade-up">
            <div className="success-animation">✓</div>
            <h3>¡Registro exitoso!</h3>
            <p>Redirigiendo...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="registro-form">
            <div className={`input-group ${errors.nombre ? 'error' : ''}`}>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Nombre completo"
                required
              />
              {errors.nombre && <span className="error-msg">{errors.nombre}</span>}
            </div>

            <div className={`input-group ${errors.email ? 'error' : ''}`}>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Correo electrónico"
                required
              />
              {errors.email && <span className="error-msg">{errors.email}</span>}
            </div>

            <div className={`input-group ${errors.password ? 'error' : ''}`}>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Contraseña (mín. 6 caracteres)"
                required
              />
              {errors.password && <span className="error-msg">{errors.password}</span>}
            </div>

            <div className={`input-group ${errors.confirmPassword ? 'error' : ''}`}>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirmar contraseña"
                required
              />
              {errors.confirmPassword && <span className="error-msg">{errors.confirmPassword}</span>}
            </div>

            {errors.submit && (
              <div className="form-error">
                {errors.submit}
              </div>
            )}

            <button
              type="submit"
              className="submit-btn"
              disabled={isSubmitting}
              data-aos="fade-up"
              data-aos-delay="500"
            >
              {isSubmitting ? <span className="spinner"></span> : 'Registrarse'}
            </button>

            <div className="login-link" data-aos="fade-up" data-aos-delay="550">
              ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default RegistroUsuarios;