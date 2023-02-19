import express from 'express';
import wrapNext from '../middlewares/wrap-next';
import { stripeWebhookHandler } from '../controllers/payment.controller';
const router = express.Router();

router
  .route('/stripe')
  .post(
    express.raw({ type: 'application/json' }),
    wrapNext(stripeWebhookHandler)
  );

export default router;
