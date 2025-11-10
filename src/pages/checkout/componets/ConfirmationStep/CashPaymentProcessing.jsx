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
    if (processing) return;

    const processPayment = async () => {
      try {
        if (!addressId) {
          throw new Error('ID de dirección no proporcionado');
        }
        
        setProcessing(true);
        
        const numericAddressId = Number(addressId);
        if (isNaN(numericAddressId)) {
          throw new Error('ID de dirección inválido');
        }

        await dispatch(confirmCashOrder({ addressId: numericAddressId })).unwrap();
        
        toast.success("Orden procesada exitosamente");
        dispatch(nextStep());

        // Espera 5 segundos antes de resetear el checkout
        setTimeout(() => {
          dispatch(resetCheckout());
        }, 5000);

      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message;
        onError(errorMessage);
      }
      // No necesitas setProcessing(false) porque el componente se desmonta
    };

    processPayment();
    // eslint-disable-next-line
  }, [addressId, dispatch, onError]);

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