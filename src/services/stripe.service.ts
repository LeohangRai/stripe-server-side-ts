import { Request } from 'express';
import Stripe from 'stripe';
import CustomError from '../utils/custom-error';

const stripeSecretKey: string = process.env.STRIPE_SECRET_KEY || '';
const endPointSecretKey: string = process.env.ENDPOINT_SECRET_KEY || '';
const clientUrl: string = process.env.CLIENT_URL || '';
const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2022-11-15',
  typescript: true
});

export async function createStripeCheckoutSession(): Promise<string | null> {
  const { url } = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Registration'
          },
          unit_amount: 10
        },
        quantity: 1
      }
    ],
    metadata: {
      transactionId: 'certain-uuid'
    },
    success_url: `${clientUrl}/success`,
    cancel_url: `${clientUrl}/cancel`
  });
  return url;
}

export async function handleStripeWebhook(req: Request) {
  const signature = req.headers['stripe-signature'] || '';
  console.log('signature:', signature);
  let event;
  try {
    /* verify stripe signature */
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      endPointSecretKey
    );
  } catch (err) {
    console.log('error:', err);
    throw new CustomError(400, `Webhook error: ${err.message}`);
  }
  if (event.type == 'checkout.session.completed') {
    const session = event.data.object;
    console.log('session:', session);
  }
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      // save the order as "complete but awaiting payment"
      console.log('session:', session);
    }
  }
  return 'ok';
}
