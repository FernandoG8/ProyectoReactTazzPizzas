import React from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useSelector } from "react-redux";
import { selectSelectedAddress } from "../../../../store/slices/checkout/checkoutSlice";

const StripePaymentForm = ({ onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [paymentError, setPaymentError] = React.useState(null);
  const selectedAddress = useSelector(selectSelectedAddress);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessing(true);
    setPaymentError(null);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout`,
        },
        redirect: "if_required",
      });

      if (error) {
        setPaymentError(error.message);
      } // Modificar la línea donde llamas a onSuccess
      else if (paymentIntent && paymentIntent.status === "succeeded") {
        onSuccess(paymentIntent);
        // Opcional: Forzar actualización del estado
        window.dispatchEvent(new Event("paymentSuccess"));
      }
    } catch (error) {
      setPaymentError(
        "Ocurrió un error al procesar el pago. Por favor, intenta de nuevo."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  if (!stripe || !elements) {
    return (
      <div className="text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-2">Cargando el formulario de pago...</p>
      </div>
    );
  }

  return (
    <div className="stripe-form-container">
      <div className="card border-0 shadow-sm p-4">
        <form onSubmit={handleSubmit} className="stripe-form">
          <div className="mb-4">
            <h5 className="mb-3">Información de facturación</h5>
            <div className="mb-3">
              <label className="form-label">Dirección seleccionada</label>
              <div>
                <strong>{selectedAddress?.street}</strong>
                <br />
                {selectedAddress?.city}, {selectedAddress?.state}
                <br />
                {selectedAddress?.country} - CP: {selectedAddress?.pincode}
              </div>
              <small className="text-muted">
                Los datos de facturación (nombre, email, teléfono, dirección) se
                pueden editar abajo.
              </small>
            </div>
            <PaymentElement options={{ layout: "tabs" }} />
          </div>

          {paymentError && (
            <div className="alert alert-danger mb-4" role="alert">
              {paymentError}
            </div>
          )}

          <div className="d-grid gap-2">
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Procesando...
                </>
              ) : (
                "Pagar ahora"
              )}
            </button>
          </div>
        </form>
      </div>
      <style jsx>{`
        .stripe-form-container {
          max-width: 600px;
          margin: 0 auto;
        }
        .stripe-form {
          width: 100%;
        }
      `}</style>
    </div>
  );
};

export default StripePaymentForm;
