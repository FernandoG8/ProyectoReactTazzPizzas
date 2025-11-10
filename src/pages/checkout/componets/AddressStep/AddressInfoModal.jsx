// src/pages/checkout/AddressInfoModal.jsx
import React from 'react';
import { Modal } from 'react-bootstrap';

const AddressInfoModal = ({ open, onClose, title, children }) => {
  return (
    <Modal show={open} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {children}
      </Modal.Body>
    </Modal>
  );
};

export default AddressInfoModal;