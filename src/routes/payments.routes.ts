import express from 'express';
import wrapNext from '../middlewares/wrap-next';
import { initiatePaymentHandler } from '../controllers/payment.controller';
const router = express.Router();

router.route('/initiate').post(wrapNext(initiatePaymentHandler));

export default router;
