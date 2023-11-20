import express from "express";
import { productController } from "../controllers/productController.js";
import { isAdmin, protect } from "../middlewares/authMiddleware.js";

// import { productImageResize, uploadFile } from '../middlewares/UploadImages.js';

const router = express.Router();

router.post(
	"/create-product",
	protect,
	isAdmin,
	productController.createProduct,
); /* finished */

router.get("/retrieve/:id", productController.getProductById); /* finished */

router.put(
	"/update/:id",
	protect,
	isAdmin,
	productController.updateProduct,
); /* finished */

router.get("/", productController.fetchAllProduct); /* finished */

router.get("/search", productController.searchProducts); /* finished */

router.put(
	"/wishlist",
	protect,
	productController.addToWishlist,
); /* finished */

router.put(
	"/remove_wishlist",
	protect,
	productController.removeFromWishlist,
); /* finished */

router.put(
	"/star-rating/comment",
	protect,
	productController.starRating,
); /* finished */

router.delete(
	"/delete/:id",
	protect,
	isAdmin,
	productController.deleteProduct,
); /* finished */

export default router;
