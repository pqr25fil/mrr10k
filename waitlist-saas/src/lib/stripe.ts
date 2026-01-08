import Stripe from "stripe";

let cachedStripe: Stripe | null = null;

export function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("Missing env: STRIPE_SECRET_KEY");
  if (!cachedStripe) {
    cachedStripe = new Stripe(key, { apiVersion: "2025-12-15.clover" });
  }
  return cachedStripe;
}

export function requireStripeEnv() {
  const required = ["STRIPE_SECRET_KEY", "STRIPE_PRICE_ID"] as const;
  for (const key of required) {
    if (!process.env[key]) throw new Error(`Missing env: ${key}`);
  }
}

