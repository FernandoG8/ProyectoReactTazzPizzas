import React from 'react';
import MenuItemCard from './MenuItemCard';
import CartContainer from './Cart.js';

const MenuUI = ({
  username,
  categories,
  category,
  searchTerm,
  setSearchTerm,
  handleSearchSubmit,
  products,
  totalPages,
  page,
  handleCategoryChange,
  setPage,
  onAddToCart,
  isLoading
}) => {

  const handleCartClick = () => {
    window.dispatchEvent(new CustomEvent("toggleCart"));
  };

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Menú</h2>
        <button
          className="btn btn-primary d-flex align-items-center gap-2"
          onClick={handleCartClick}
        >
          🛒 Carrito
        </button>
      </div>

      {/* Filters */}
      <div className="row mb-4 align-items-end">
        <div className="col-md-6">
          <div className="form-group">
            <select
              className="form-select"
              value={category}
              onChange={handleCategoryChange}
            >
              <option value="all">Todos los productos</option>
              {categories.map(cat => (
                <option key={cat.categoryId} value={cat.categoryId}>
                  {cat.categoryName}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="col-md-6">
          <div className="form-group">
            <div className="d-flex">
              <input
                type="text"
                className="form-control me-2"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Products */}
      {isLoading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p>Cargando productos...</p>
        </div>
      ) : (
        <>
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {products.map(product => (
              <div className="col" key={product.productId}>
                <MenuItemCard
                  product={product}
                  onAddToCart={onAddToCart}
                />
              </div>
            ))}
          </div>

          {products.length === 0 && !isLoading && (
            <div className="text-center py-5">
              <p>No se encontraron productos</p>
            </div>
          )}

          {totalPages > 1 && (
            <nav className="mt-4">
              <ul className="pagination justify-content-center">
                {Array.from({ length: totalPages }, (_, i) => (
                  <li
                    key={i}
                    className={`page-item ${page === i ? 'active' : ''}`}
                  >
                    <button
                      className="page-link"
                      onClick={() => setPage(i)}
                    >
                      {i + 1}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </>
      )}

      {/* Cart */}
      <CartContainer />
    </div>
  );
};

export default MenuUI;
