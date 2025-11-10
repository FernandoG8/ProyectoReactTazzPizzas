// src/pages/checkout/AddressList.jsx
import React from 'react';
import './AddressList.css';

const AddressList = ({ addresses, selectedAddress, onSelect, onEdit, onDelete }) => {
  const handleAddressClick = (e, address) => {
    e.preventDefault();
    e.stopPropagation();
    onSelect(address);
  };

  const handleEditClick = (e, address) => {
    e.stopPropagation();
    onEdit(address);
  };

  const handleDeleteClick = (e, addressId) => {
    e.stopPropagation();
    onDelete(addressId);
  };

  return (
    <div className="address-list">
      {addresses.map((address) => (
        <div
          key={address.addressId}
          className={`address-card ${selectedAddress?.addressId === address.addressId ? 'selected' : ''}`}
          onClick={(e) => handleAddressClick(e, address)}
        >
          <div className="address-selector">
            <div className={`radio-outer ${selectedAddress?.addressId === address.addressId ? 'selected' : ''}`}>
              <div className={`radio-inner ${selectedAddress?.addressId === address.addressId ? 'selected' : ''}`}></div>
            </div>
          </div>

          <div className="address-content">
            <div className="address-icon">
              <i className="bi bi-house-door"></i>
            </div>
            
            <div className="address-details">
              <h6 className="building-name">
                {address.buildingName}
                {selectedAddress?.addressId === address.addressId && (
                  <span className="selected-badge">
                    <i className="bi bi-check-circle-fill"></i> Seleccionada
                  </span>
                )}
              </h6>
              <p className="street-name">
                <i className="bi bi-geo-alt text-muted me-1"></i>
                {address.street}
              </p>
              <div className="address-meta">
                <span>
                  <i className="bi bi-building text-muted me-1"></i>
                  {address.city}
                </span>
                <span className="mx-2">•</span>
                <span>{address.state}</span>
                <span className="mx-2">•</span>
                <span>{address.pincode}</span>
              </div>
              <small className="country">
                <i className="bi bi-globe2 text-muted me-1"></i>
                {address.country}
              </small>
            </div>

            <div className="address-actions">
              <button
                type="button"
                className="action-btn edit-btn"
                onClick={(e) => handleEditClick(e, address)}
                title="Editar dirección"
              >
                <i >🖋️</i>
              </button>
              <button
                type="button"
                className="action-btn delete-btn"
                onClick={(e) => handleDeleteClick(e, address.addressId)}
                title="Eliminar dirección"
              >
                <i > 🗑️</i>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AddressList;