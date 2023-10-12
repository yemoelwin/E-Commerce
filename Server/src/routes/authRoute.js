import express from 'express';
import { userInfo } from '../controllers/userController.js';
import { protect, isAdmin } from '../middlewares/authMiddleware.js';
const router = express.Router();

router.post('/register', userInfo.userRegister); /* finished */

router.get('/verify_email/:token/:_id', userInfo.verifyRegisterEmail); /* finished */

router.post('/login', userInfo.userLogin); /* finished */ 

// router.post('/admin-login', userInfo.adminLogin); /* finished */

router.get('/refresh-token', userInfo.handleRefreshToken); /* finished */

router.get('/alluser', protect, isAdmin, userInfo.getAllUser); /* finished */

router.get('/:id', protect, userInfo.getUserById); /* finished */

router.put('/edit-user', protect, userInfo.updatedUser); /* finished */

router.put('/save-address/:_id', protect, userInfo.saveAddress); /* finished */

router.post('/order/create_order', protect, userInfo.createOrder); /* finished */

router.get('/order/get_order_byuser/:id', protect, userInfo.userOrder); /* finished */

router.get('/order/allorders', protect, isAdmin, userInfo.getAllOrders); /* finished */

router.put('/order/update_user_order_status/:id', protect, isAdmin, userInfo.updateOrderStatus); /*finished*/

router.delete('/delete_order/:id', protect, isAdmin, userInfo.deleteOrder); /* finished */

router.get('/wish/user_wishlist', protect, userInfo.wishList); /* finished */

router.put('/block-user/:id', protect, isAdmin, userInfo.blockUser); /* finished */

router.put('/unblock-user/:id', protect, isAdmin, userInfo.unBlockUser); /* finished */

router.post('/logout', userInfo.Logout); /* finished */

router.get('/reset-password/:userId/:uniqueToken', userInfo.verifyResetToken); /* finished */

router.post('/update-password', protect, userInfo.updatePassword); /* finished */

router.post('/forgot-password', userInfo.forgotPasswordToken); /* finished */

router.post('/reset-password/:userId/:uniqueToken', userInfo.resetPassword); /* finished */

router.delete('/:id', protect, isAdmin, userInfo.deleteUser); /* finished */

/* --------------------Unnecessary Code--------------------- */

router.post('/cart/apply_coupon', protect, userInfo.applyCoupon);

router.post('/addtocart', protect, userInfo.addToCart); /* finished */

router.get('/cart/get-usercart', protect, userInfo.getUserCart); /* finished */

router.delete('/cart/delete-cart-products', protect, userInfo.emptyCart); /* finished */

router.delete('/cart/remove-cart-products', protect, userInfo.removeItemFromCart); /* finished */

router.put('/cart/update-cart-items-quantity', protect, userInfo.updateItemQuantity); /* finished */

export default router