import React from 'react';

const EditCategoryModal = ({ show, category, onClose, onChange, onSubmit }) => {
  if (!show || !category) return null;

  return (
    <div className="modal show fade d-block" tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Editar Categoría</h5>
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
              />
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>Cancelar</button>
            <button className="btn btn-primary" onClick={onSubmit}>Guardar Cambios</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCategoryModal;