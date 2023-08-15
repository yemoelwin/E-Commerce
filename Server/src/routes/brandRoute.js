import express from 'express';
import { Brand } from '../controllers/brandController.js';
import { protect, isAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/create-brand', protect, isAdmin, Brand.createBrand); /* finished */

router.put('/update/:id', protect, isAdmin, Brand.updateBrand); /* finished */

router.get('/:id', protect, Brand.getBrand); /* finished */

router.get('/', Brand.getAllBrand); /* finished */

router.delete('/delete/:id', Brand.deleteBrand); /* finished */

export default router;