import express from 'express';
import { Brand } from '../controllers/brandController.js';
import { protect, isAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/post/add-brand', protect, isAdmin, Brand.createBrand); /* finished */

router.put('/updBrand/:_id', protect, isAdmin, Brand.updateBrand); /* finished */

router.get('/single/:_id', protect, isAdmin, Brand.getBrand); /* finished */

router.get('/', Brand.getAllBrand); /* finished */

router.delete('/delete/:_id', isAdmin, Brand.deleteBrand); /* finished */

export default router;

// 5EAa#Gxea32NV+R