import React from 'react';
import { Link } from 'react-router-dom';
import apiImages from '../../services/api-images'; // Import the dedicated images API

const MenuItemCard = ({ product, onAddToCart }) => {
  const placeholderImage = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80';
  
  const getImageUrl = () => {
    if (!product.image) return placeholderImage;
    
    if (product.image.startsWith('http')) {
      return product.image;
    }
    
    // Use the images API base URL
    return `${apiImages.defaults.baseURL}/images/${product.image}`;
  };

  const imageUrl = getImageUrl();

  const displayPrice = product.specialPrice ? (
    <>
      <span className="text-muted text-decoration-line-through">${product.price}</span>{' '}
      <span>${product.specialPrice}</span>
    </>
  ) : (
    <span>${product.price}</span>
  );

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (onAddToCart) {
      onAddToCart(product.productId, 1);
    }
  };

  return (
    <div className="card h-100">
      <img
        src={imageUrl}
        className="card-img-top"
        alt={product.productName}
        style={{ height: '200px', objectFit: 'cover' }}
        onError={(e) => {
          e.target.src = placeholderImage;
        }}
      />
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{product.productName}</h5>
        <p className="card-text">{product.description || 'Delicioso producto'}</p>
        <p className="card-text mt-auto">{displayPrice}</p>
        <div className="d-flex justify-content-between gap-2">
          <button 
            className="btn btn-outline-dark flex-grow-1"
            onClick={handleAddToCart}
          >
            Agregar
          </button>
          <Link
            to={`/producto/${product.productId}`}
            className="btn btn-dark flex-grow-1"
          >
            Ver más
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MenuItemCard;