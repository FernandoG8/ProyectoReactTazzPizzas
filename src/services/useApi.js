// src/hooks/useApi.js
import { useState, useEffect } from 'react';
import api from 'api'; // Importa tu configuración de Axios

const useApi = (method, endpoint, body = null) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      let options = {
        method,
        url: endpoint,
        data: body,
      };

      const response = await api(options);  // Usamos la instancia de axios que ya tiene configurado el token

      setData(response.data);
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [method, endpoint, body]);

  return { data, loading, error };
};

export default useApi;
