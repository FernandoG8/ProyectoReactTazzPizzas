import React from 'react';

const AddProductModal = ({ show, product, categories, onClose, onChange, onSubmit }) => {
  if (!show) return null;

  return (
    <div className="modal show fade d-block" tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Agregar Producto</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div className="mb-2">
              <label>Nombre</label>
              <input className="form-control" type="text" name="productName" value={product.productName} onChange={onChange} />
            </div>
            <div className="mb-2">
              <label>Descripción</label>
              <textarea className="form-control" name="description" value={product.description} onChange={onChange} />
            </div>
            <div className="mb-2">
              <label>Cantidad</label>
              <input className="form-control" type="number" name="quantity" value={product.quantity} onChange={onChange} min="0" max="100"/>
            </div>
            <div className="mb-2">
              <label>Precio</label>
              <input className="form-control" type="number" name="price" value={product.price} onChange={onChange} min="0" />
            </div>
            <div className="mb-2">
              <label>Descuento</label>
              <input className="form-control" type="number" name="discount" value={product.discount} onChange={onChange} min="0" />
            </div>
            <div className="mb-2">
              <label>Categoría</label>
              <select className="form-control" name="categoryId" value={product.categoryId} onChange={onChange}>
                <option value="">Seleccione una categoría</option>
                {categories.map(cat => (
                  <option key={cat.categoryId} value={cat.categoryId}>{cat.categoryName}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>Cancelar</button>
            <button className="btn btn-success" onClick={onSubmit}>Agregar Producto</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProductModal;
