import express from 'express';
import { Enquiry } from '../controllers/enquiryController.js';
import { protect, isAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/create-enquiry', Enquiry.createEnquiry); /* finished */

router.put('/update/:id', protect, isAdmin, Enquiry.updateEnquiry); /* finished */

router.get('/:id', protect, isAdmin, Enquiry.getEnquiry); /* finished */

router.get('/', protect, isAdmin, Enquiry.getAllEnquiry); /* finished */

router.delete('/delete/:id', protect, isAdmin, Enquiry.deleteEnquiry); /* finished */

export default router;