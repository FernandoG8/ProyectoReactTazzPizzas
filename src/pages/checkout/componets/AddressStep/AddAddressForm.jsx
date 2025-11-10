// src/pages/checkout/AddAddressForm.jsx
import React from 'react';
import { useForm } from 'react-hook-form';

const AddAddressForm = ({ initialData = {}, onSubmit, loading = false }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: initialData
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Street */}
      <div className="mb-3">
        <label className="form-label">Calle</label>
        <input
          className={`form-control ${errors.street ? 'is-invalid' : ''}`}
          {...register('street', { 
            required: 'La calle es requerida',
            minLength: {
              value: 5,
              message: 'La calle debe tener al menos 5 caracteres'
            }
          })}
          placeholder="Ej: Market Street"
        />
        {errors.street && <div className="invalid-feedback">{errors.street.message}</div>}
      </div>

      {/* Building Name */}
      <div className="mb-3">
        <label className="form-label">Nombre del edificio/Casa</label>
        <input
          className={`form-control ${errors.buildingName ? 'is-invalid' : ''}`}
          {...register('buildingName', { 
            required: 'El nombre del edificio es requerido'
          })}
          placeholder="Ej: Bay Apartments"
        />
        {errors.buildingName && <div className="invalid-feedback">{errors.buildingName.message}</div>}
      </div>

      {/* City */}
      <div className="mb-3">
        <label className="form-label">Ciudad</label>
        <input
          className={`form-control ${errors.city ? 'is-invalid' : ''}`}
          {...register('city', { 
            required: 'La ciudad es requerida'
          })}
          placeholder="Ej: San Francisco"
        />
        {errors.city && <div className="invalid-feedback">{errors.city.message}</div>}
      </div>

      {/* State */}
      <div className="mb-3">
        <label className="form-label">Estado</label>
        <input
          className={`form-control ${errors.state ? 'is-invalid' : ''}`}
          {...register('state', { 
            required: 'El estado es requerido'
          })}
          placeholder="Ej: California"
        />
        {errors.state && <div className="invalid-feedback">{errors.state.message}</div>}
      </div>

      {/* Pincode (ZIP Code) */}
      <div className="mb-3">
        <label className="form-label">Código Postal</label>
        <input
          className={`form-control ${errors.pincode ? 'is-invalid' : ''}`}
          {...register('pincode', {
            required: 'El código postal es requerido',
            pattern: {
              value: /^\d{5}$/,
              message: 'El código postal debe tener 5 dígitos'
            }
          })}
          placeholder="Ej: 94103"
        />
        {errors.pincode && <div className="invalid-feedback">{errors.pincode.message}</div>}
      </div>

      {/* Country */}
      <div className="mb-3">
        <label className="form-label">País</label>
        <input
          className={`form-control ${errors.country ? 'is-invalid' : ''}`}
          {...register('country', { 
            required: 'El país es requerido'
          })}
          placeholder="Ej: USA"
        />
        {errors.country && <div className="invalid-feedback">{errors.country.message}</div>}
      </div>

      {/* Submit Button */}
      <div className="d-flex justify-content-end gap-2">
        <button 
          type="submit" 
          className="btn btn-primary" 
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Guardando...
            </>
          ) : (
            <>
              <i className="bi bi-check2 me-2"></i>
              Guardar dirección
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default AddAddressForm;