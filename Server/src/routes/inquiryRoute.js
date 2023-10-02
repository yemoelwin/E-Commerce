import express from 'express';
import { Inquiry } from '../controllers/inquiryController.js';
import { protect, isAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/create-inquiry', Inquiry.createInquiry); /* finished */

router.put('/update/:id', protect, isAdmin, Inquiry.updateInquiry); /* finished */

router.get('/:id', protect, isAdmin, Inquiry.getInquiry); /* finished */

router.get('/', protect, isAdmin, Inquiry.getAllInquiry); /* finished */

router.delete('/delete/:id', protect, isAdmin, Inquiry.deleteInquiry); /* finished */

export default router;