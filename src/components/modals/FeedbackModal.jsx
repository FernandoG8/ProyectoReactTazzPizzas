import React from 'react';

const FeedbackModal = ({ show, message, type, onClose }) => {
  if (!show) return null;

  const bgColor = type === 'success' ? 'bg-success' : 'bg-danger';
  const title = type === 'success' ? 'Éxito' : 'Error';

  return (
    <div className="modal show fade d-block" tabIndex="-1">
      <div className="modal-dialog modal-sm">
        <div className={`modal-content text-white ${bgColor}`}>
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <p>{message}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;
