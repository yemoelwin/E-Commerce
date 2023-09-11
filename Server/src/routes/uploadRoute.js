import express from 'express';
import { uploadImageController } from '../controllers/uploadController.js';
import { isAdmin, protect } from '../middlewares/authMiddleware.js';
import { upload } from '../middlewares/ImageUpload.js';
import { productImgResize } from '../middlewares/imageResize.js';

// import { productImageResize, uploadFile } from '../middlewares/UploadImages.js';

const router = express.Router();

router.post('/images', protect, isAdmin, upload.array('images',10), productImgResize, uploadImageController.uploadImages); /* now images can be saved in local storage but can't upload to cloud server. */

router.delete('/delete_images/:id', protect, isAdmin, uploadImageController.deleteImage);

export default router;