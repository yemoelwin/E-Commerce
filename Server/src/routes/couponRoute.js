import express from 'express';
import { couponInfo } from '../controllers/couponController.js';
import { protect, isAdmin } from '../middlewares/authMiddleware.js';
const router = express.Router();

router.post('/createCoupon', protect, isAdmin, couponInfo.createCoupon); /* finished */

router.get('/', couponInfo.getAllCoupon); /* finished */

router.get('/:_id', protect, couponInfo.getCoupon); /* finished */

router.delete('/:_id', protect, isAdmin, couponInfo.deleteCoupon); /* finished */

export default router;