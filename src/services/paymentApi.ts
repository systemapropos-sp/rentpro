import { supabase } from './supabaseClient';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || '');

export async function createPaymentIntent(
  amount: number,
  currency: string = 'usd',
  bookingId: string
) {
  const { data, error } = await supabase.functions.invoke('create-payment-intent', {
    body: { amount, currency, bookingId },
  });

  if (error) throw error;
  return data;
}

export async function confirmPayment(clientSecret: string) {
  const stripe = await stripePromise;
  if (!stripe) throw new Error('Stripe not loaded');

  const { error } = await stripe.confirmCardPayment(clientSecret);
  if (error) throw error;
  return true;
}

export async function createPayout(hostId: string, amount: number) {
  const { data, error } = await supabase.functions.invoke('create-payout', {
    body: { hostId, amount },
  });

  if (error) throw error;
  return data;
}

export function calculatePricing(
  nightlyPrice: number,
  nights: number,
  cleaningFee: number = 50,
  serviceFeePercentage: number = 12
) {
  const subtotal = nightlyPrice * nights;
  const serviceFee = Math.round(subtotal * (serviceFeePercentage / 100));
  const total = subtotal + cleaningFee + serviceFee;

  return {
    nightlyPrice,
    nights,
    subtotal,
    cleaningFee,
    serviceFee,
    total,
  };
}
