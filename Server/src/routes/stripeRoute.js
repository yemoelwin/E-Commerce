import express from 'express';

import { stripeSession, webHook } from '../controllers/stripeController.js';

import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/create-payment-intent', protect, stripeSession); /* finished */

router.post('/webhook', express.raw({ type: "application/json" }), webHook);

// router.post('/create_order', createOrder);

export default router;