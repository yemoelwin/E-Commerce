import express from 'express';
import { productController } from '../controllers/productController.js';

const router = express.Router();

router.post('/create-product', productController.createProduct);

router.get('/:id', productController.getProductById);

router.get('/', productController.fetchAllProduct);

export default router;