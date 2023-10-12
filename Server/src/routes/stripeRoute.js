import express from 'express';
import { stripeSession } from '../controllers/stripeController.js';
import { protect } from '../middlewares/authMiddleware.js';
const router = express.Router();

router.post('/create-payment-intent', protect, stripeSession); /* finished */
// console.log('Received a request for create-payment-intent');
export default router;