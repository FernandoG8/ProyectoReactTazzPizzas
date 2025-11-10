import React, { useEffect, useState } from 'react';
import api from '../services/api';

const Home = () => {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await api.get('/productos');  // Endpoint de la API
        setProductos(response.data);
      } catch (error) {
        console.error('Error al obtener productos:', error);
      }
    };

    fetchProductos();
  }, []);

  return (
    <div>
      <h2>Productos de Pizza</h2>
      <div>
        {productos.map((producto) => (
          <div key={producto.id}>
            <h3>{producto.nombre}</h3>
            <p>{producto.descripcion}</p>
            <p>${producto.precio}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
