import express from 'express';
import { Category } from '../controllers/prodCategoryController.js';
import { protect, isAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/create-category', protect, isAdmin, Category.createCategory); /* finished */

router.put('/update/:id', protect, isAdmin, Category.updateCategory); /* finished */

router.get('/:id', protect, Category.fetchCategoryById); /* finished */

router.delete('/:id', protect, isAdmin, Category.deleteCategory); /* finished */

router.get('/', Category.getAllCategory); /* finished */

export default router;