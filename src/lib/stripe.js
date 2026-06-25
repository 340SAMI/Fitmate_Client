import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
 import 'server-only'



export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)