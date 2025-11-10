import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { confirmCashOrder } from "../../../../store/slices/checkout/checkoutThunks";
import {
  nextStep,
  resetCheckout
} from "../../../../store/slices/checkout/checkoutSlice";

const CashPaymentProcessing = ({ addressId, onError }) => {
  const dispatch = useDispatch();
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!addressId || processing) {
      return;
    }

    let isSubscribed = true;

    const processPayment = async () => {
      try {
        setProcessing(true);

        const numericAddressId = Number(addressId);
        if (Number.isNaN(numericAddressId) || numericAddressId <= 0) {
          throw new Error('ID de dirección inválido');
        }

        await dispatch(confirmCashOrder({ addressId: numericAddressId })).unwrap();

        if (!isSubscribed) return;

        toast.success("Orden procesada exitosamente");
        dispatch(nextStep());

        setTimeout(() => {
          dispatch(resetCheckout());
        }, 5000);
      } catch (error) {
        if (!isSubscribed) return;
        const errorMessage = error.response?.data?.message || error.message;
        onError(errorMessage);
      }
    };

    processPayment();

    return () => {
      isSubscribed = false;
    };
  }, [addressId, dispatch, onError, processing]);

  return (
    <div className="text-center py-5">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Procesando orden...</span>
      </div>
      <p className="mt-3">Procesando tu orden de pago en efectivo...</p>
      <p className="text-muted small">Por favor, no cierres esta ventana</p>
    </div>
  );
};

export default CashPaymentProcessing;
