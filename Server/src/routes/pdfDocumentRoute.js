import express from 'express';
import { pdfDocument } from '../controllers/invoiceController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/pdf-invoice/:orderId', protect, pdfDocument); /* finished */

export default router;