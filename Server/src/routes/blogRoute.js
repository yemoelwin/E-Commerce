import express from 'express';
import { Blog } from '../controllers/blogController.js';
import { protect, isAdmin } from '../middlewares/authMiddleware.js';
// import { blogImgResize } from '../middlewares/imageResize.js';
// import { blogMiddleware } from '../middlewares/ImageUpload.js';

const router = express.Router();

router.post('/create-blog', protect, isAdmin, Blog.createBlog); /* finished */

router.put('/update/:id', protect, Blog.updateBlog); /* finished */

// router.put('/upload/:id', protect, isAdmin, blogMiddleware.array('images',2),  Blog.uploadBlogImages); /* under development process( now works as local storage but cannot upload to cloud server ) */

router.get('/:id', protect, Blog.getBlogById); /* finished */

// router.put('/like-dislike', protect, Blog.LikedAndDisLiked);

router.put('/liked-disliked', protect, Blog.toggleLikeAndDislike ); /* finished */

// router.put('/like-dislike/:id', protect, Blog.isLikedAndDisLiked);

router.get('/', Blog.fetchAllBlogs); /* finished */

router.delete('/:id', Blog.deleteBlog); /* finished */

export default router;

