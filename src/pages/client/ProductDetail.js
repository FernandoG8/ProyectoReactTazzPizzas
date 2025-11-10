import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';
import apiImages from '../../services/api-images';
import 'bootstrap/dist/css/bootstrap.min.css';

const ProductDetail = () => {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [productosRelacionados, setProductosRelacionados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  const placeholderImage = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80';

  const quantityRef = useRef();


  const getImageUrl = (productData) => {
    if (!productData) return placeholderImage;

    if (productData.image && productData.image.startsWith('http')) {
      return productData.image;
    }

    if (productData.image) {
      return `${apiImages.defaults.baseURL}/images/${productData.image}`;
    }

    if (productData.productId) {
      return `${apiImages.defaults.baseURL}/images/products/${productData.productId}`;
    }

    return placeholderImage;
  };

  const normalizeProductData = (data, categoriesList) => {
    if (!data) return null;

    // Buscar el nombre de la categoría usando el categoryId
    const category = categoriesList.find(cat => cat.categoryId === data.categoryId);

    return {
      id: data.productId,
      nombre: data.productName || 'Producto sin nombre',
      precio: data.price || 0,
      categoria: category ? category.categoryName : 'Sin categoría',
      categoriaId: data.categoryId,
      descripcion: data.description || 'Sin descripción disponible',
      imagen: getImageUrl(data),
      ingredientes: data.ingredients,
      tamano: data.size
    };
  };

  const handleAddToCart = async (productId, quantity) => {
    try {
      const response = await api.post(
        `/carts/products/${productId}/quantity/${quantity}`,
        {}
      );

      if (response.status === 201) {
        console.log("Producto agregado al carrito");
        window.dispatchEvent(new CustomEvent("cartUpdated"));
      }
    } catch (error) {
      console.error("Error al agregar producto al carrito:", error);
    }
  };

  useEffect(() => {
    const loadProductData = async () => {
      setLoading(true);
      try {
        // Cargar categorías primero
        const categoriesResponse = await api.get('/public/categories');
        setCategories(categoriesResponse.data.content);

        // Cargar el producto principal
        const productResponse = await api.get(`/public/products/${id}`);
        const normalizedProduct = normalizeProductData(productResponse.data, categoriesResponse.data.content);
        setProducto(normalizedProduct);

        // Obtener productos relacionados si tenemos categoría
        if (normalizedProduct.categoriaId) {
          try {
            const relatedResponse = await api.get(`/public/categories/${normalizedProduct.categoriaId}/products`);
            const relacionados = relatedResponse.data.content
              .filter(p => p.productId !== normalizedProduct.id)
              .slice(0, 4)
              .map(p => normalizeProductData(p, categoriesResponse.data.content));

            setProductosRelacionados(relacionados);
          } catch (error) {
            console.error("Error al cargar productos relacionados:", error);
          }
        }
      } catch (error) {
        console.error("Error al cargar el producto:", error);
        setProducto({
          id: 0,
          nombre: 'Producto no disponible',
          descripcion: 'Lo sentimos, este producto no está disponible actualmente.',
          imagen: placeholderImage,
          precio: 0,
          categoria: 'Error'
        });
      } finally {
        setLoading(false);
      }
    };

    loadProductData();
  }, [id]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status" style={{ width: '4rem', height: '4rem' }}>
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3">Cargando producto...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5 mt-5">
      {/* Detalles del producto */}
      <div className="row justify-content-center align-items-center mb-5">
        <div className="col-md-6 mb-4">
          <img
            src={producto.imagen}
            alt={producto.nombre}
            className="img-fluid rounded shadow-lg border border-light"
            style={{ maxHeight: '400px', width: '100%', objectFit: 'cover' }}
            onError={(e) => {
              e.target.src = placeholderImage;
            }}
          />
        </div>
        <div className="col-md-6">
          <div className="d-flex flex-column justify-content-between h-100">
            <div>
              <span className="badge bg-secondary mb-2">{producto.categoria}</span>
              <h1 className="mb-3 text-primary font-weight-bold">{producto.nombre}</h1>
              <h4 className="text-success mb-4">${producto.precio.toFixed(2)}</h4>
              <p className="lead">{producto.descripcion}</p>

              {producto.ingredientes && (
                <div className="mt-3">
                  <h5>Ingredientes:</h5>
                  <p>{producto.ingredientes}</p>
                </div>
              )}

              {producto.tamano && (
                <div className="mt-2">
                  <h5>Tamaño:</h5>
                  <p>{producto.tamano}</p>
                </div>
              )}
            </div>
            <div className="mt-4">
              <div className="d-flex flex-wrap">
                <div className="me-2 mb-2">
                  <input
                    type="number"
                    className="form-control"
                    defaultValue="1"
                    min="1"
                    max="10"
                    style={{ width: '70px' }}
                    ref={quantityRef}
                  />
                </div>
                <button
                  className="btn btn-primary btn-lg flex-grow-1"
                  onClick={() => handleAddToCart(producto.id, parseInt(quantityRef.current.value, 10))}
                >
                  Agregar al carrito
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Productos relacionados */}
      {productosRelacionados.length > 0 && (
        <div className="mt-5">
          <h3 className="mb-4 text-center">Productos similares</h3>
          <div className="row">
            {productosRelacionados.map(prod => (
              <div className="col-md-3 col-sm-6 mb-4" key={prod.id}>
                <div className="card h-100 shadow-sm hover-shadow">
                  <img
                    src={prod.imagen}
                    alt={prod.nombre}
                    className="card-img-top"
                    style={{ height: '180px', objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.src = placeholderImage;
                    }}
                  />
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{prod.nombre}</h5>
                    <p className="card-text text-success">${prod.precio.toFixed(2)}</p>
                    <a
                      href={`/producto/${prod.id}`}
                      className="btn btn-outline-primary mt-auto"
                    >
                      Ver detalles
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;