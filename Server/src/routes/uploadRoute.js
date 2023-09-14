import express from 'express';
import { uploadImageController } from '../controllers/uploadController.js';
import { isAdmin, protect } from '../middlewares/authMiddleware.js';
import { blogUpload, productUpload } from '../middlewares/ImageUpload.js';
import { blogImgResize, productImgResize } from '../middlewares/imageResize.js';

// import { productImageResize, uploadFile } from '../middlewares/UploadImages.js';

const router = express.Router();

router.post('/images', protect, isAdmin, productUpload.array('images', 5), productImgResize, uploadImageController.uploadImages); /* now images can be saved in local storage but can't upload to cloud server. */

router.post('/blog/images', protect, isAdmin, blogUpload.array('images', 2), blogImgResize, uploadImageController.uploadImages); /* now images can be saved in local storage but can't upload to cloud server. */

router.delete('/delete_images/:id', protect, isAdmin, uploadImageController.deleteImage);

export default router;