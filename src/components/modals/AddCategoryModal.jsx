import React from 'react';

const AddCategoryModal = ({ show, category, onClose, onChange, onSubmit }) => {
  if (!show) return null;

  return (
    <div className="modal show fade d-block" tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Agregar Categoría</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div className="mb-2">
              <label>Nombre</label>
              <input 
                className="form-control" 
                type="text" 
                name="categoryName" 
                value={category.categoryName || ''} 
                onChange={onChange} 
                placeholder="Ingrese el nombre de la categoría"
              />
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>Cancelar</button>
            <button className="btn btn-success" onClick={onSubmit}>Agregar Categoría</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCategoryModal;