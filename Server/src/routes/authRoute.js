import express from "express";
import { userInfo } from "../controllers/userController.js";
import { protect, isAdmin } from "../middlewares/authMiddleware.js";
const router = express.Router();

router.post("/register", userInfo.userRegister);

router.get("/verify_email/:_id/:code", userInfo.verifyRegisterEmail);

router.post("/auth/login", userInfo.userLogin);

/*  */
router.post("/auth/user-logout", protect, userInfo.Logout);
/*  */

router.get("/refresh-token", userInfo.handleRefreshToken);

router.get("/alluser", protect, isAdmin, userInfo.getAllUser);

router.get("/:id", protect, userInfo.getUserById);

router.put("/edit-user", protect, userInfo.updatedUser);

router.put("/save-address/:_id", protect, userInfo.saveAddress);

router.post("/order/create_userOrder", protect, userInfo.saveUserOrder);

router.get(
	"/order/get_order/:userId/:transitionId",
	protect,
	userInfo.getOrder,
);
router.get("/order/user-orders/:id", protect, userInfo.getUserOrders);

router.get("/order/all-orders", protect, isAdmin, userInfo.getAllOrders);

router.put(
	"/order/order_status/:id",
	protect,
	isAdmin,
	userInfo.updateOrderStatus,
);

router.delete("/delete_order/:id", protect, isAdmin, userInfo.deleteOrder);

router.get("/wish/user_wishlist", protect, userInfo.wishList);

router.put("/block-user/:id", protect, isAdmin, userInfo.blockUser);

router.put("/unblock-user/:id", protect, isAdmin, userInfo.unBlockUser);

router.post("/update-password", protect, userInfo.updatePassword);

router.post("/forgot-password", userInfo.forgotPasswordToken);

router.post("/reset-password/:userId/:uniqueToken", userInfo.resetPassword);

router.delete("/:id", protect, isAdmin, userInfo.deleteUser);

export default router;

/* --------------------Unnecessary Code--------------------- */

// router.post('/cart?addtocart', protect, userInfo.addToCart);

// router.get('/reset-password/:userId/:uniqueToken', userInfo.verifyResetToken);

// router.post('/cart/apply_coupon', protect, userInfo.applyCoupon);

// router.get('/cart/get-usercart', protect, userInfo.getUserCart);

// router.delete('/cart/delete-cart-products', protect, userInfo.emptyCart);

// router.delete('/cart/remove-cart-products', protect, userInfo.removeItemFromCart);

// router.put('/cart/update-cart-items-quantity', protect, userInfo.updateItemQuantity);
