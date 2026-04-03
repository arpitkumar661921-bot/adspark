import Stripe from "stripe";
import { getEnv } from "@/lib/env";

const env = getEnv();

export const stripe = env.STRIPE_SECRET_KEY 
  ? new Stripe(env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-03-31.basil"
    })
  : null;

export const PRO_PLAN_PRICE_ID = env.STRIPE_PRO_PRICE_ID || "";
export const STRIPE_WEBHOOK_SECRET = env.STRIPE_WEBHOOK_SECRET || "";
