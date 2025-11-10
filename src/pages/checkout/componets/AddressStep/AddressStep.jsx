// src/pages/checkout/AddressStep.jsx
import React from 'react';
import { useDispatch } from 'react-redux';
import { setAddress, nextStep } from '../../../../store/slices/checkout/checkoutSlice';
import AddressForm from './AddressForm';

const AddressStep = () => {
  const dispatch = useDispatch();

  const handleAddressSubmit = (address) => {
    dispatch(setAddress(address));
    dispatch(nextStep());
  };

  return (
    <div>
      <h4>Dirección de envío</h4>
      <AddressForm onSubmit={handleAddressSubmit} />
    </div>
  );
};

export default AddressStep;