import express from 'express';
import { productController } from '../controllers/productController.js';
import { isAdmin, protect } from '../middlewares/authMiddleware.js';
import { upload } from '../middlewares/ImageUpload.js';
import { productImgResize } from '../middlewares/imageResize.js';

// import { productImageResize, uploadFile } from '../middlewares/UploadImages.js';

const router = express.Router();

router.post('/create-product', protect, productController.createProduct); /* finished */

// router.put('/upload/:id', protect, productMiddleware.array('images', 10), productController.uploadImagesAndFormatSizes); /* now images can be saved in local storage but can't upload to cloud server. */

router.put('/upload/:id', protect, upload.array('images',10), productImgResize, productController.uploadImagesAndFormatSizes); /* now images can be saved in local storage but can't upload to cloud server. */

router.get('/:id', protect, productController.getProductById); /* finished */

router.put('/update/:id', protect, productController.updateProduct); /* finished */

router.get('/', productController.fetchAllProduct); /* finished */

router.put('/wishlist', protect, productController.addToWishlist); /* finished */

router.put('/star-rating/comment', protect, productController.starRating); /* finished */

router.delete('/delete/:id', protect, productController.deleteProduct); /* finished */

export default router;