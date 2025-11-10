import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  fetchCart,
  createPaymentIntent
} from '../../../../store/slices/checkout/checkoutThunks';

import {
  selectOrderSummary,
  selectSelectedAddress,
  selectLoading,
  selectPaymentMethod,
  prevStep,
  setLoading
} from '../../../../store/slices/checkout/checkoutSlice';

const CheckoutSummary = ({ onProceedToPayment }) => {
  const dispatch = useDispatch();
  const orderSummary = useSelector(selectOrderSummary);
  const selectedAddress = useSelector(selectSelectedAddress);
  const loading = useSelector(selectLoading);
  const paymentMethod = useSelector(selectPaymentMethod);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleRefreshCart = async () => {
    try {
      await dispatch(fetchCart()).unwrap();
      toast.success("Carrito actualizado correctamente");
    } catch (refreshError) {
      toast.error("Error al actualizar el carrito");
    }
  };

  const handleProceedToPayment = async () => {
    try {
      await dispatch(fetchCart()).unwrap();

      if (!orderSummary?.totalPrice || orderSummary.totalPrice === 0) {
        toast.error("El total de la orden no es válido");
        return;
      }

      if (paymentMethod === "CARD") {
        dispatch(setLoading(true));
        const clientSecret = await dispatch(
          createPaymentIntent(orderSummary.totalPrice)
        ).unwrap();

        if (clientSecret) {
          onProceedToPayment(clientSecret);
        } else {
          toast.error("No se pudo obtener el client secret de Stripe.");
        }
      } else if (paymentMethod === "CASH") {
        onProceedToPayment();
      } else {
        toast.error("Selecciona un método de pago válido");
      }
    } catch (error) {
      console.error("Error en la creación del payment intent:", error);
      toast.error(
        error.message ||
          "Error al crear la intención de pago. Intenta de nuevo."
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  if (!orderSummary || !selectedAddress) {
    return (
      <div className="alert alert-danger">
        <i className="bi bi-exclamation-triangle me-2"></i>
        No se pudo cargar la información del pedido.
        <button
          className="btn btn-link"
          onClick={handleRefreshCart}
          disabled={loading}
        >
          Intentar nuevamente
        </button>
      </div>
    );
  }

  if (!orderSummary.products?.length) {
    return (
      <div className="alert alert-warning">
        <i className="bi bi-cart-x me-2"></i>
        Tu carrito está vacío. Agrega productos para continuar con la compra.
        <button
          className="btn btn-link"
          onClick={handleRefreshCart}
          disabled={loading}
        >
          Actualizar carrito
        </button>
      </div>
    );
  }

  if (orderSummary.totalPrice <= 0) {
    return (
      <div className="alert alert-danger">
        <i className="bi bi-currency-dollar me-2"></i>
        El total de la orden no es válido. Verifica los productos en tu carrito.
        <button
          className="btn btn-link"
          onClick={handleRefreshCart}
          disabled={loading}
        >
          Actualizar carrito
        </button>
      </div>
    );
  }

  const paymentMethodLabel =
    paymentMethod === "CARD"
      ? "Tarjeta de Crédito/Débito"
      : paymentMethod === "CASH"
      ? "Efectivo"
      : "No seleccionado";

  return (
    <div className="summary-container">
      <div className="d-flex justify-content-end mb-3">
        <button
          className="btn btn-outline-secondary btn-sm"
          onClick={handleRefreshCart}
          disabled={loading}
        >
          <i className="bi bi-arrow-clockwise me-1"></i>
          Actualizar carrito
        </button>
      </div>

      <div className="mb-4">
        <h4 className="mb-3">Dirección de envío</h4>
        <div className="card">
          <div className="card-body">
            <p className="mb-1">{selectedAddress.buildingName}</p>
            <p className="mb-1">{selectedAddress.street}</p>
            <p className="mb-1">
              {selectedAddress.city}, {selectedAddress.state}
            </p>
            <p className="mb-1">{selectedAddress.country}</p>
            <p className="mb-0">CP: {selectedAddress.pincode}</p>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h4 className="mb-3">Método de pago</h4>
        <div className="card">
          <div className="card-body d-flex align-items-center">
            <span className="me-2" style={{ fontSize: "1.5rem" }}>
              {paymentMethod === "CARD"
                ? "💳"
                : paymentMethod === "CASH"
                ? "💵"
                : "❓"}
            </span>
            <span>
              <strong>{paymentMethodLabel}</strong>
            </span>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h4 className="mb-3">Productos</h4>
        {orderSummary.products.map((product) => (
          <div key={product.productId} className="card mb-2">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  <img
                    src={product.image || "https://placehold.co/100x100"}
                    alt={product.productName}
                    className="me-3"
                    style={{
                      width: "60px",
                      height: "60px",
                      objectFit: "cover"
                    }}
                  />
                  <div>
                    <h6 className="mb-0">{product.productName}</h6>
                    <small className="text-muted">
                      Cantidad: {product.quantity}
                    </small>
                    {product.description && (
                      <p className="small text-muted mb-0">
                        {product.description}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-end">
                  <p className="mb-0 fw-bold">
                    ${product.specialPrice * product.quantity}
                  </p>
                  {product.discount > 0 && (
                    <small className="text-success">
                      Ahorro: ${product.discount * product.quantity}
                    </small>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <div className="d-flex justify-content-between mb-2">
            <span>Subtotal</span>
            <span>${orderSummary.totalPrice}</span>
          </div>
          <div className="d-flex justify-content-between mb-2">
            <span>Envío</span>
            <span>Gratis</span>
          </div>
          <hr />
          <div className="d-flex justify-content-between fw-bold">
            <span>Total</span>
            <span>${orderSummary.totalPrice}</span>
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center">
        <button
          className="btn btn-outline-primary"
          onClick={() => dispatch(prevStep())}
          disabled={loading}
        >
          <i className="bi bi-arrow-left me-2"></i>
          Atrás
        </button>

        <button
          className="btn btn-primary"
          onClick={handleProceedToPayment}
          disabled={loading}
        >
          {loading ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              ></span>
              Procesando...
            </>
          ) : (
            <>
              {paymentMethod === "CARD"
                ? "Pagar con tarjeta"
                : paymentMethod === "CASH"
                ? "Confirmar pedido"
                : "Continuar al pago"}
              <i className="bi bi-arrow-right ms-2"></i>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default CheckoutSummary;
