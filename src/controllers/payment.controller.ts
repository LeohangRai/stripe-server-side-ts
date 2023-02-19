import { Request, Response } from 'express';
import {
  createStripeCheckoutSession,
  handleStripeWebhook
} from '../services/stripe.service';

export async function initiatePaymentHandler(req: Request, res: Response) {
  const redirectUrl = await createStripeCheckoutSession();
  return res.status(201).json({
    status: 'success',
    redirectUrl
  });
}

export async function stripeWebhookHandler(req: Request, res: Response) {
  await handleStripeWebhook(req);
  return res.status(200).send();
}
