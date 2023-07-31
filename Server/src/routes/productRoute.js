import express from 'express';
import { productController } from '../controllers/productController.js';
import { isAdmin, protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/create-product', productController.createProduct);

router.get('/:id', productController.getProductById);

router.put('/:id', protect, isAdmin, productController.updateProduct);

router.get('/', productController.fetchAllProduct);

router.delete('/delete/:id', protect, isAdmin, productController.deleteProduct);

export default router;