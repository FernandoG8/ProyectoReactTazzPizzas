// src/config/stripe.js
import { loadStripe } from '@stripe/stripe-js';

const stripePublicKey = process.env.REACT_APP_STRIPE_PUBLIC_KEY;

if (!stripePublicKey) {
  console.error('¡Advertencia! La clave pública de Stripe no está configurada');
}

export const stripePromise = loadStripe(stripePublicKey);