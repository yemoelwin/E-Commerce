import express from 'express';
import { BlogCategory } from '../controllers/blogCategoryController.js';
import { protect, isAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/create-blogcategory', protect, isAdmin, BlogCategory.createBlogCategory); /* finished */

router.put('/update/:id', protect, isAdmin, BlogCategory.updateBlogCategory); /* finished */

router.get('/:id', protect, isAdmin, BlogCategory.getBlogCategoryById); /* finished */

router.get('/', protect, isAdmin, BlogCategory.getAllBlogCategory); /* finished */

router.delete('/delete/:id', protect, isAdmin, BlogCategory.deleteBlogCategory); /* finished */

export default router;