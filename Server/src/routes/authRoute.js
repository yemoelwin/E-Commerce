import express from 'express';
import { userInfo } from '../controllers/userController.js';
import { protect, isAdmin } from '../middlewares/authMiddleware.js';
const router = express.Router();

router.post('/register', userInfo.userRegister); /* finished */

router.get('/verify_email/:token/:_id', userInfo.verifyRegisterEmail); /* finished */

router.post('/login', userInfo.userLogin); /* finished */ 

router.post('/admin-login', userInfo.adminLogin); /* finished */

router.get('/refresh-token', userInfo.handleRefreshToken); /* finished */

router.get('/alluser', userInfo.getAllUser); /* finished */

router.get('/:id', protect, isAdmin, userInfo.getUserById); /* finished */

router.put('/edit-user', protect, userInfo.updatedUser); /* finished */

router.put('/save-address/:_id', protect, userInfo.saveAddress); /* finished */

router.post('/apply_coupon', protect, userInfo.applyCoupon);

router.get('/wishlist/:_id', protect, userInfo.getWishlist); /* finished */

router.post('/addtocart', protect, userInfo.addToCart); /* finished */

router.get('/get-usercart/:_id', protect, userInfo.getUserCart); /* finished */

router.delete('/remove-cart-products', protect, userInfo.emptyCart); /* finished */

router.post('/order_items', protect, userInfo.creatOrder);

router.put('/block-user/:id', protect, isAdmin, userInfo.blockUser); /* finished */

router.put('/unblock-user/:id', protect, isAdmin, userInfo.unBlockUser); /* finished */

router.post('/logout', userInfo.Logout); /* finished */

router.get('/reset-password/:userId/:uniqueToken', userInfo.verifyResetToken); /* finished */

router.post('/update-password', protect, userInfo.updatePassword); /* finished */

router.post('/forgot-password', userInfo.forgotPasswordToken); /* finished */

router.post('/reset-password/:userId/:uniqueToken', userInfo.resetPassword); /* finished */

router.delete('/:id', userInfo.deleteUser); /* finished */

export default router