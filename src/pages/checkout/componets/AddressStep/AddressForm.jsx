// src/pages/checkout/AddressForm.jsx
import React from 'react';
import { useForm } from 'react-hook-form';

const AddressForm = ({ onSubmit }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-3">
        <label className="form-label">Calle y número</label>
        <input className="form-control" {...register('street', { required: 'La calle es requerida' })} />
        {errors.street && <div className="text-danger">{errors.street.message}</div>}
      </div>
      <div className="mb-3">
        <label className="form-label">Ciudad</label>
        <input className="form-control" {...register('city', { required: 'La ciudad es requerida' })} />
        {errors.city && <div className="text-danger">{errors.city.message}</div>}
      </div>
      <div className="mb-3">
        <label className="form-label">Estado</label>
        <input className="form-control" {...register('state', { required: 'El estado es requerido' })} />
        {errors.state && <div className="text-danger">{errors.state.message}</div>}
      </div>
      <div className="mb-3">
        <label className="form-label">Código Postal</label>
        <input className="form-control" {...register('zipCode', { required: 'El código postal es requerido' })} />
        {errors.zipCode && <div className="text-danger">{errors.zipCode.message}</div>}
      </div>
      <div className="mb-3">
        <label className="form-label">País</label>
        <input className="form-control" {...register('country', { required: 'El país es requerido' })} />
        {errors.country && <div className="text-danger">{errors.country.message}</div>}
      </div>
      <button type="submit" className="btn btn-primary">Guardar y continuar</button>
    </form>
  );
};

export default AddressForm;