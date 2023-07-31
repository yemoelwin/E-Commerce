import express from 'express';
import { Blog } from '../controllers/blog.controller.js';
import { protect, isAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/createBlog', protect, isAdmin, Blog.createBlog);

router.put('/update/:id', protect, Blog.updateBlog);

router.get('/:id', protect, Blog.getBlogById);

// router.get('/:blogId', protect, Blog.isLiked);

router.post('/:id/like-dislike', protect, Blog.LikedAndDisLiked);

router.get('/', Blog.fetchAllBlogs);

router.delete('/:id', Blog.deleteBlog);

export default router;

