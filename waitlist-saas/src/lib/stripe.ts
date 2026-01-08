import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2024-06-20",
});

export function requireStripeEnv() {
  const required = ["STRIPE_SECRET_KEY", "STRIPE_PRICE_ID"] as const;
  for (const key of required) {
    if (!process.env[key]) throw new Error(`Missing env: ${key}`);
  }
}

