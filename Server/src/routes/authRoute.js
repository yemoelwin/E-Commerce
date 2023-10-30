import express from 'express';
import { userInfo } from '../controllers/userController.js';
import { protect, isAdmin } from '../middlewares/authMiddleware.js';
const router = express.Router();

router.post('/register', userInfo.userRegister); /* finished */

router.get('/verify_email/:token/:_id', userInfo.verifyRegisterEmail); /* finished */

router.post('/auth/login', userInfo.userLogin); /* finished */

router.post('/auth/user-logout', protect, userInfo.Logout);

// Add a middleware function to log access to the route
router.use('/auth/user-logout', (req, res, next) => {
    console.log('Access to route /auth/user-logout');
    next(); // Continue processing the route
});

router.get('/refresh-token', userInfo.handleRefreshToken); /* finished */

router.get('/alluser', protect, isAdmin, userInfo.getAllUser); /* finished */

router.get('/:id', protect, userInfo.getUserById); /* finished */

router.put('/edit-user', protect, userInfo.updatedUser); /* finished */

router.put('/save-address/:_id', protect, userInfo.saveAddress); /* finished */

router.post('/order/create_userOrder', protect, userInfo.saveUserOrder); /* finished */

router.get('/order/get_order/:userId/:transitionId', protect, userInfo.getOrder); /* finished */

router.get('/order/user-orders/:id', protect, userInfo.getUserOrders); /* finished */

router.get('/order/all-orders', protect, isAdmin, userInfo.getAllOrders); /* finished */

router.put('/order/order_status/:id', protect, isAdmin, userInfo.updateOrderStatus); /*finished*/

router.delete('/delete_order/:id', protect, isAdmin, userInfo.deleteOrder); /* finished */

router.get('/wish/user_wishlist', protect, userInfo.wishList); /* finished */

router.put('/block-user/:id', protect, isAdmin, userInfo.blockUser); /* finished */

router.put('/unblock-user/:id', protect, isAdmin, userInfo.unBlockUser); /* finished */

router.post('/update-password', protect, userInfo.updatePassword); /* finished */

router.post('/forgot-password', userInfo.forgotPasswordToken); /* finished */

router.post('/reset-password/:userId/:uniqueToken', userInfo.resetPassword); /* finished */

router.delete('/:id', protect, isAdmin, userInfo.deleteUser); /* finished */

export default router;

/* --------------------Unnecessary Code--------------------- */

// router.post('/cart?addtocart', protect, userInfo.addToCart);

// router.get('/reset-password/:userId/:uniqueToken', userInfo.verifyResetToken); 

// router.post('/cart/apply_coupon', protect, userInfo.applyCoupon);

// router.get('/cart/get-usercart', protect, userInfo.getUserCart); 

// router.delete('/cart/delete-cart-products', protect, userInfo.emptyCart);

// router.delete('/cart/remove-cart-products', protect, userInfo.removeItemFromCart);

// router.put('/cart/update-cart-items-quantity', protect, userInfo.updateItemQuantity);

