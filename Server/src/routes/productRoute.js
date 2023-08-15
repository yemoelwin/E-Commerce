import express from 'express';
import { productController } from '../controllers/productController.js';
import { isAdmin, protect } from '../middlewares/authMiddleware.js';
import { productMiddleware } from '../middlewares/ImageUpload.js';
import { productImgResize } from '../middlewares/imageResize.js';

// import { productImageResize, uploadFile } from '../middlewares/UploadImages.js';

const router = express.Router();

router.post('/create-product', productController.createProduct); /* finished */

router.put('/upload/:id', productMiddleware.array('images',10), productController.uploadImagesAndFormatSizes); /* now images can be saved in local storage but can't upload to cloud server. */

router.get('/:id', protect, productController.getProductById); /* finished */

router.put('/update/:id', protect, isAdmin, productController.updateProduct); /* finished */

router.get('/', productController.fetchAllProduct); /* finished */

router.put('/wishlist', protect, productController.addToWishlist); /* finished */

router.put('/star-rating/comment', protect, productController.starRating); /* finished */

router.delete('/delete/:id', protect, isAdmin, productController.deleteProduct); /* finished */

export default router;