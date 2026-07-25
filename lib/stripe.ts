import Stripe from "stripe";

let stripeInstance: Stripe | null = null;

/** Renvoie le client Stripe serveur, ou `null` si STRIPE_SECRET_KEY n'est pas configurée. */
export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  if (!stripeInstance) {
    stripeInstance = new Stripe(key);
  }
  return stripeInstance;
}
