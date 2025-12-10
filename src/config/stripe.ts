// config/stripe.ts
import { loadStripe } from "@stripe/stripe-js";

let stripePromise: ReturnType<typeof loadStripe> | null = null;

const getStripe = () => {
  if (!stripePromise) {
    const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    if (!key) {
      console.error("Stripe publishable key is missing!");
      return null;
    }
    stripePromise = loadStripe(key);
  }
  return stripePromise;
};

export default getStripe;
