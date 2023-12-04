import Order from "../models/orderModel.js";
import User from "../models/userModel.js";
import Product from "../models/productModel.js";
import Cart from "../models/cartModel.js";
import Coupon from "../models/couponModel.js";
import UserVerification from "../models/userVerification.js";
import UserPasswordVerification from "../models/passwordVerification.js";
import { sendVerificationEmail, ResetPasswordToken } from "./Email.js";
import bcrypt from "bcryptjs";
import asyncHandler from "express-async-handler";
import { generateAccessToken } from "../config/jwtToken.js";
import { generateRefreshToken } from "../config/refreshToken.js";
import { validateMongodbID } from "../utils/validateMongodbID.js";
import jwt from "jsonwebtoken";
import uniqid from "uniqid";
import { config } from "dotenv";
import ProductModel from "../models/productModel.js";
config();

const userRegister = asyncHandler(async (req, res) => {
	try {
		// Extract the required fields from the request body
		const { firstname, lastname, email, mobile, password } = req.body;
		const existingUser = await User.findOne({ $or: [{ email }, { mobile }] });
		if (existingUser) {
			if (existingUser.email === email) {
				return res
					.status(409)
					.json({ message: "User with this email already exists!" });
			} else if (existingUser.mobile === mobile) {
				return res
					.status(409)
					.json({ message: "User with this mobile number already exists!" });
			}
		}
		const saltRounds = 12;
		const hashedPassword = await bcrypt.hash(password, saltRounds);
		const newUser = new User({
			firstname,
			lastname,
			email,
			mobile,
			password: hashedPassword,
			verified: false,
		});
		if (email === "yemoelwin142@gmail.com") {
			newUser.role = "admin"; // Set role to admin for specific email
		}
		const savedUser = await newUser.save();
		await sendVerificationEmail(savedUser);
		res.status(200).json(newUser);
	} catch (error) {
		res.status(400).json({
			status: "FAILED",
			message: error.message,
		});
	}
});

const verifyRegisterEmail = asyncHandler(async (req, res) => {
	let { token, _id } = req.params;
	console.log("Received userId from route params:", _id);
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		if (_id !== decoded._id) {
			return res.status(400).json({ message: "Invalid user ID." });
		}
		console.log("decode", decoded);
		const verificationRecord = await UserVerification.findOne({
			userId: _id,
			token,
			expiredAt: { $gt: Date.now() },
		});
		if (!verificationRecord) {
			return res.status(400).json({
				status: "FAILED",
				message: "Invalid or expired verification link.",
			});
		}
		await User.findByIdAndUpdate(
			_id,
			{ $set: { verified: true } },
			{ new: true },
		);
		return res.json({
			message: "Email verified successfully.You can login now.",
		});
	} catch (error) {
		console.error("Error during email verification:", error);
		res.status(500).json({
			status: "FAILED",
			message:
				"An error occurred during email verification. Please try again later.",
		});
	}
});

const userLogin = asyncHandler(async (req, res) => {
	try {
		const { email, password } = req.body;
		if (!email || !password) {
			return res.status(400).json({ message: "All fields are required." });
		}
		const user = await User.findOne({ email });
		const genericErrorMessage = "Invalid email or password";
		const verifyEmailMessage = "Verify Your Email";
		if (!user) {
			res.status(401).json({
				status: "FAILED",
				message: genericErrorMessage,
			});
			return;
		}
		if (user.verified === false) {
			return res.status(403).json({
				status: "FAILED",
				message: verifyEmailMessage,
			});
		}
		const isMatched = await bcrypt.compare(password, user.password);
		if (isMatched) {
			const userType = user.role === "admin" ? "admin" : "user";
			const refreshToken = generateRefreshToken(user?._id);
			const accessToken = generateAccessToken(user?._id);
			await User.findByIdAndUpdate(
				user._id,
				{
					refreshToken,
				},
				{
					new: true,
				},
			);
			res.cookie("refreshToken", refreshToken, {
				httpOnly: true,
				secure: true, // Use only on HTTPS connections
				sameSite: "None",
				maxAge: 30 * 24 * 60 * 60 * 1000,
				// domain: '.localhost',
			});
			res.status(200).json({
				_id: user?._id,
				firstname: user?.firstname,
				lastname: user?.lastname,
				email: user?.email,
				role: userType,
				token: accessToken,
				refreshToken: refreshToken,
				status: "Success",
				message: `${
					userType === "admin" ? "Admin" : "User"
				} logged in successfully`,
			});
		} else {
			res.status(401).json({
				status: "FAILED",
				message: genericErrorMessage,
			});
		}
	} catch (error) {
		res.status(500).json({
			status: "FAILED",
			message: "An error occurred while login and pls try again.",
		});
	}
});

const Logout = asyncHandler(async (req, res) => {
	try {
		const cookie = req.cookies;
		console.log("cookies", cookie);
		if (!cookie?.refreshToken)
			return res.status(401).json({ message: "No Refresh Token in Cookies." });
		const refreshToken = cookie.refreshToken;
		const user = await User.findOne({ refreshToken });
		if (!user) {
			res.clearCookie("refreshToken", {
				httpOnly: true,
				secure: true,
				sameSite: "None",
			});
			return res.sendStatus(403); /* forbidden */
		}
		// Here, we are deleting it, but you can also mark it as invalid in your database
		await User.findOneAndUpdate(
			{ refreshToken },
			{ $unset: { refreshToken: 1 } },
		);
		res.clearCookie("refreshToken", {
			httpOnly: true,
			secure: true,
			sameSite: "None",
		});
		res.status(200).json("Cookie cleared and logged out successfully.");
	} catch (error) {
		console.log(error);
		res.status(500).json("Internal Server Error.");
	}
});

const handleRefreshToken = asyncHandler(async (req, res) => {
	const cookie = req.cookies;
	console.log(cookie);
	if (!cookie?.refreshToken)
		return res.status(401).json({ message: "No Refresh Token in Cookies." });
	const refreshToken = cookie.refreshToken;
	console.log(refreshToken);
	const user = await User.findOne({ refreshToken });
	if (!user) throw new Error("No refresh token present in db or not matched.");
	jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
		console.log(decoded);
		if (err || user.id !== decoded.id) {
			throw new Error("There is something wrong with refresh token");
		}
		const accessToken = generateAccessToken(user?._id);
		res.json({ accessToken });
	});
});

const resetPassword = asyncHandler(async (req, res) => {
	try {
		const { userId, uniqueToken } = req.params;
		console.log("userId", userId);
		console.log("uniqueToken", uniqueToken);
		const { password } = req.body;
		console.log("password", password);
		if (!password) {
			return res.status(400).json({
				status: "FAILED",
				message: "New password is missing in the request body.",
			});
		}
		const verificationData = await UserPasswordVerification.findOne({
			userId,
			uniqueToken,
			uniqueTokenExpiredAt: { $gt: Date.now() }, // Check if token is not expired
		});
		if (!verificationData) {
			return res.status(400).json({
				status: "FAILED",
				message: "Invalid or expired reset token.",
			});
		}
		const hashedPassword = await bcrypt.hash(password, 12);
		const updatedUser = await User.findById(userId);
		if (!updatedUser) {
			return res.status(404).json({ message: "User not found." });
		}
		updatedUser.password = hashedPassword;
		updatedUser.passwordChangedAt = new Date();
		await updatedUser.save();
		console.log("updatedUser", updatedUser);
		res.status(200).json({
			status: "SUCCESS",
			message:
				"Password reset successful. You can now log in with your new password.",
		});
	} catch (error) {
		res.status(500).json({
			status: "FAILED",
			message: "An error occurred during password reset.",
		});
	}
});

const getAllUser = asyncHandler(async (req, res) => {
	try {
		const getUsers = await User.find();
		res.status(200).json(getUsers);
	} catch (error) {
		throw new Error(error);
	}
});

const getUserById = asyncHandler(async (req, res) => {
	const { id } = req.user;
	validateMongodbID(id);
	try {
		const user = await User.findById(id);
		if (!user) {
			return res.status(404).json({
				message: "User Not Found!",
			});
		}
		res.json({
			user,
		});
	} catch (error) {
		throw new Error(error);
	}
	// if (req.user.isAdmin || req.user._id.toString() === id) {
	//     res.status(200).json({
	//     user,
	// });
	// } else {
	// res.status(403).json({
	//     message: 'Not authorized to access user data',
	//     });
	// }
});

const updatedUser = asyncHandler(async (req, res) => {
	const { id } = req.user;
	validateMongodbID(id);
	console.log("requser", req.user);
	try {
		const updatedUser = await User.findByIdAndUpdate(
			id,
			{
				firstname: req?.body?.firstname,
				lastname: req?.body?.lastname,
				email: req?.body?.email,
				mobile: req?.body?.mobile,
				password: req?.body?.password,
			},
			{
				new: true,
			},
		);
		res.json(updatedUser);
	} catch (error) {
		throw new Error(error);
	}
});

const deleteUser = asyncHandler(async (req, res) => {
	const { id } = req.params;
	validateMongodbID(id);
	try {
		const user = await User.findByIdAndDelete(id);
		if (!user) {
			return res.status(404).json({
				status: "FAILED",
				message: "User not found.",
			});
		}
		res.status(200).json({
			status: "SUCCESS",
			message: "User successfully deleted.",
		});
	} catch (error) {
		res.status(500).json({
			status: "FAILED",
			message: "An error occurred while deleting and pls try again.",
		});
	}
});

const wishList = asyncHandler(async (req, res) => {
	const { _id } = req.user;
	try {
		const user = await User.findById(_id).populate("wishlist");
		if (!user) {
			return res.status(404).json({ message: "User not found." });
		}
		res.status(200).json({ user, message: "User Wishlist" });
	} catch (error) {
		console.error("error", error);
		res.status(500).json({
			status: "FAILED",
			message: "An error occurred while getting wishlist.",
		});
	}
});

const saveUserOrder = asyncHandler(async (req, res) => {
	const { _id } = req.user;
	console.log("userID serverside", _id);
	const { cartData, cartTotalAmount, totalQuantity, transitionId } = req.body;
	console.log(
		"cartData from backend",
		cartData,
		cartTotalAmount,
		totalQuantity,
		transitionId,
	);
	try {
		const existingOne = await Order.find({
			customerId: _id,
			stripe_response: false,
		});
		console.log("exitone", existingOne);

		if (existingOne.length !== 0) {
			await Order.updateOne(
				{ _id: existingOne[0]._id },
				{
					$set: {
						products: cartData,
						transitionId,
						totalQuantity,
						subTotalAmount: cartTotalAmount,
					},
				},
			);
			res.status(200).json({ message: "success" });
		} else {
			const newOrder = new Order({
				transitionId: transitionId,
				customerId: _id,
				products: cartData,
				totalQuantity: totalQuantity,
				subTotalAmount: cartTotalAmount,
				createdAt: new Date(),
			});
			await newOrder.save();
			res.status(200).json({ message: "success", newOrder });
		}
	} catch (error) {
		console.log("Error saving cart:", error);
		throw error; // Handle the error appropriately in your application
	}
});

const getOrder = asyncHandler(async (req, res) => {
	const { userId, transitionId } = req.params;
	console.log(userId, transitionId);
	try {
		const userOrder = await Order.findOne({
			customerId: userId,
			transitionId,
			stripe_response: true,
		});
		if (!userOrder) {
			return res.status(404).json({ message: "Order not found" });
		}
		res.status(200).json(userOrder);
	} catch (error) {
		console.log("error", error);
		res
			.status(500)
			.json({ message: "Error occurred while retrieving user order." });
	}
});

const getUserOrders = asyncHandler(async (req, res) => {
	const { id } = req.params;
	try {
		const userOrders = await Order.find({
			customerId: id,
			stripe_response: true,
		});
		if (!userOrders) {
			return res.status(404).json({ message: "empty order list." });
		}
		res.status(200).json(userOrders);
	} catch (error) {
		throw new Error(error);
	}
});

const getAllOrders = asyncHandler(async (req, res) => {
	try {
		const allOrders = await Order.find({ stripe_response: true });
		if (!allOrders) {
			return res.status(404).json({ message: "empty order list." });
		}
		res.status(200).json(allOrders);
	} catch (error) {
		throw new Error(error);
	}
});

const updateOrderStatus = asyncHandler(async (req, res) => {
	const { delivery_status } = req.body;
	const { id } = req.params;
	validateMongodbID(id);
	try {
		const updateOrderStatus = await Order.findByIdAndUpdate(
			id,
			{
				delivery_status: delivery_status,
			},
			{ new: true },
		);
		res.json(updateOrderStatus);
	} catch (error) {
		console.log("error", error);
		res.status(500).json({ message: "Error Occurred while ordering." });
	}
});

/* --------------Beaware of under development && need to implement function  */

const forgotPasswordToken = asyncHandler(async (req, res) => {
	try {
		const { email } = req.body;
		const user = await User.findOne({ email });
		if (!user)
			return res.status(404).json({ message: "email does not exist." });
		const resetToken = await ResetPasswordToken({ _id: user._id, email });
		res.status(200).json(resetToken);
	} catch (error) {
		res.status(500).json({
			message:
				"An error occurred while processing the password reset request. Please try again.",
		});
	}
});

const updatePassword = asyncHandler(async (req, res) => {
	console.log("req", req);
	try {
		const { userId, oldPassword, newPassword } = req.body;
		const user = await User.findById(userId);
		if (!user) return res.status(404).json({ message: "User not found." });
		const isPasswordMatched = await bcrypt.compare(oldPassword, user.password);
		if (!isPasswordMatched)
			return res.status(400).json({ message: "Invalid old password." });
		const updatedPassword = await bcrypt.hash(newPassword, 12);
		user.password = updatedPassword;
		user.passwordChangedAt = new Date();
		await user.save();
		res.status(200).json({ message: "Password updated successfully." });
	} catch (error) {
		res.status(500).json({ message: "Internal server error." });
	}
});

const saveAddress = asyncHandler(async (req, res) => {
	const { _id } = req.params;
	console.log("userId", _id);
	try {
		const updatedUser = await User.findByIdAndUpdate(
			_id,
			{
				address: req?.body.address,
			},
			{ new: true },
		);
		console.log("updatedUser", updatedUser);
		res.status(200).json(updatedUser);
	} catch (error) {
		res.status(500).json({ message: "Internal server error." });
	}
});

const blockUser = asyncHandler(async (req, res) => {
	try {
		const { id } = req.params;
		const blockuser = await User.findByIdAndUpdate(
			id,
			{
				isBlocked: true,
			},
			{
				new: true,
			},
		);
		res.status(200).json({
			blockuser,
			status: "SUCCESS",
			message: "Successfully blocked.",
		});
	} catch (error) {
		res.status(500).json({
			status: "FAILED",
			message: "An error occurred and try again.",
		});
	}
});

const unBlockUser = asyncHandler(async (req, res) => {
	try {
		const { id } = req.params;
		const unblockuser = await User.findByIdAndUpdate(
			id,
			{
				isBlocked: false,
			},
			{
				new: true,
			},
		);
		res.status(200).json({
			unblockuser,
			status: "SUCCESS",
			message:
				"This user is no longer blocked and now access and authorization to their corresponding part.",
		});
	} catch (error) {
		res.status(500).json({
			status: "FAILED",
			message: "An error occurred and try again.",
		});
	}
});

/* -------------------Beaware Unnecessary function --------------------- */

const verifyResetToken = asyncHandler(async (req, res) => {
	const { userId, uniqueToken } = req.params;
	console.log("userId", userId);
	console.log("resetPasswordToken", uniqueToken);
	try {
		const verifyResetToken = await UserPasswordVerification.findOne({
			userId,
			uniqueToken,
			uniqueTokenExpiredAt: { $gt: Date.now() },
		});
		console.log("verifyResetToken", verifyResetToken);
		if (!verifyResetToken) {
			return res.status(400).json({
				status: "FAILED",
				message: "Invalid or expired reset password token.",
			});
		}
		res.status(200).json({ message: "enter your new password." });
	} catch (error) {
		console.error("Error resetting email password :", error);
		res.status(500).json({
			status: "FAILED",
			message:
				"An error occurred during password reset. Please try again later.",
		});
	}
});

const addToCart = asyncHandler(async (req, res) => {
	const { productId, title, brand, color, quantity, price } = req.body;
	const { _id } = req.user;
	try {
		let cart = await Cart.findOne({ userId: _id });
		if (!cart) {
			return res.status(404).json({ message: "User does not exist." });
		}
		let newCart = new Cart({
			userId: _id,
			productId,
			title,
			brand,
			color,
			quantity,
			price,
		});
		await newCart.save();
		res
			.status(200)
			.json({ message: "Successfully save the items to cart.", newCart });
	} catch (error) {
		console.log("error", error);
		res.status(500).json({
			message: "Error Occurred while adding the product to the user's cart",
		});
	}
});

const applyCoupon = asyncHandler(async (req, res) => {
	const { couponId } = req.body;
	const { _id } = req.user;
	try {
		const validCoupon = await Coupon.findOne({ code: couponId });
		if (!validCoupon) {
			return res
				.status(400)
				.json({ message: "Invalid coupon code. Coupon not found." });
		}
		const cart = await Cart.findOne({ orderby: _id });
		let cartTotalPrice = cart.cartTotalPrice;
		let totalAfterDiscount = (
			cartTotalPrice -
			(cartTotalPrice * validCoupon.discount) / 100
		).toFixed(2);
		await Cart.findOneAndUpdate(
			{ orderby: _id },
			{ totalAfterDiscount },
			{ new: true },
		);
		return res.status(200).json({
			message: "Coupon applied successfully.",
			totalBeforeDiscount: cartTotalPrice.toFixed(2),
			totalAfterDiscount,
		});
	} catch (error) {
		console.log("error", error);
		res
			.status(500)
			.json({ message: "Error Occurred while applying the coupon." });
	}
});

const creatOrderX = asyncHandler(async (req, res) => {
	const { COD, couponApplied, Prepaid } = req.body;
	const { _id } = req.user;
	try {
		if (!COD && !Prepaid) {
			return res.status(500).json({ message: "Failed." });
		}
		const user = await User.findById(_id);
		const userCart = await Cart.findOne({ orderby: user._id })
			.populate("products.product", "_id color title price brand quantity")
			.populate("orderby", "firstname lastname email mobile");
		let finalAmount = 0;
		if (couponApplied && userCart.totalAfterDiscount) {
			finalAmount = userCart.totalAfterDiscount;
		} else {
			finalAmount = userCart.cartTotalPrice;
		}
		const paymentMethod = COD ? "COD" : "Prepaid";
		const orderStatus = COD ? "Cash on Delivery" : "Prepaid";
		const newOrder = new Order({
			products: userCart.products,
			payment: [
				{
					id: uniqid(),
					method: paymentMethod,
					amount: finalAmount,
					status: orderStatus,
					createdAt: new Date(),
					currency: "usd",
				},
			],
			orderby: user._id,
			orderStatus: orderStatus,
		});
		await newOrder.save();
		res.status(200).json({ newOrder, message: "Order created successfully." });
		const bulkWriteOperations = userCart.products.map((item) => ({
			updateOne: {
				filter: { _id: item.product._id },
				update: { $inc: { quantity: -item.count, sold: +item.count } },
			},
		}));
		await Product.bulkWrite(bulkWriteOperations, {});
	} catch (error) {
		console.log("error", error);
		res
			.status(500)
			.json({ message: "Error Occurred while creating ordering." });
	}
});

const deleteOrder = asyncHandler(async (req, res) => {
	const { id } = req.params;
	validateMongodbID(id);
	try {
		const order = await Order.findByIdAndDelete(id);
		if (!order) {
			return res.status(404).json({
				status: "FAILED",
				message: "Order not found.",
			});
		}
		res.status(200).json({
			status: "SUCCESS",
			message: "Order successfully deleted.",
		});
	} catch (error) {
		res.status(500).json({
			status: "FAILED",
			message: "An error occurred while deleting and pls try again.",
		});
	}
});

// const addToCart = asyncHandler(async (req, res) => {
//     const { cart } = req.body;
//     const { _id } = req.user;
//     try {
//         const user = await User.findById(_id)
//         if (!user) {
//             return res.status(404).json({ message: 'Error'})
//         }
//         let products = [];
//         await Cart.findOneAndDelete({ orderby: user._id })
//         for (let i = 0; i < cart.length; i++){
//             let object = [];
//             object.product = cart[i]._id;
//             object.count = cart[i].count;
//             object.color = cart[i].color;
//             let getPrice = await Product.findById(cart[i]._id).select('price').exec();
//             object.price = getPrice.price;
//             products.push(object)
//         }
//         let cartTotalPrice = 0;
//         for (let i = 0; i < products.length; i++){
//             cartTotalPrice += products[i].price * products[i].count;
//         }
//         let newCart = new Cart({
//             products,
//             cartTotalPrice,
//             orderby: user?._id
//         })
//         await newCart.save();
//         res.status(200).json({ message: 'Items have been added to your cart.', newCart})
//         console.log("products and cartTotal", products);
//     } catch (error) {
//         console.log('error', error);
//         res.status(500).json({ message: "Error Occurred while adding the product to the user's cart" });
//     }
// })

const addToCartOne = asyncHandler(async (req, res) => {
	const { cart } = req.body;
	const { _id } = req.user;
	try {
		const user = await User.findById(_id);
		if (!user) {
			return res.status(404).json({ message: "Error" });
		}
		let products = [];
		// Use Promise.all to fetch prices for all products concurrently
		const getPricePromises = cart.map(async (cartItem) => {
			try {
				const product = await Product.findById(cartItem._id)
					.select("price")
					.exec();
				if (!product) {
					throw new Error("Product not found");
				}
				const object = {
					product: cartItem._id,
					count: cartItem.count,
					color: cartItem.color,
					price: product.price,
				};
				products.push(object);
			} catch (error) {
				console.error("Error fetching product price:", error);
			}
		});
		await Promise.all(getPricePromises);
		let cartTotalPrice = 0;
		for (let i = 0; i < products.length; i++) {
			cartTotalPrice += products[i].price * products[i].count;
		}
		let newCart = new Cart({
			products,
			cartTotalPrice,
			orderby: user?._id,
		});
		await newCart.save();
		res
			.status(200)
			.json({ message: "Items have been added to your cart.", newCart });
		console.log("products and cartTotal", products);
	} catch (error) {
		console.log("error", error);
		res.status(500).json({
			message: "Error Occurred while adding the product to the user's cart",
		});
	}
});

const getUserCart = asyncHandler(async (req, res) => {
	const { _id } = req.user;
	try {
		const cart = await Cart.find({ userId: _id }).populate("productId");
		if (!cart || cart === "null") {
			return res.status(404).json({ message: "Cart is empty." });
		}
		res.status(200).json(cart);
	} catch (error) {
		console.log("error", error);
		res.status(500).json({
			message: "Error Occurred while getting the product of the user's cart",
		});
	}
});

const removeItemFromCart = asyncHandler(async (req, res) => {
	const { _id } = req.user;
	const { cartItemId } = req.body;
	try {
		const deletedItem = await Cart.deleteOne({
			userId: _id,
			_id: cartItemId,
		}).populate("productId");
		if (!deletedItem || deletedItem === "null") {
			return res.status(404).json({ message: "Cart is empty." });
		}
		res.status(200).json(deletedItem);
	} catch (error) {
		console.log("error", error);
		res.status(500).json({
			message: "Error Occurred while getting the product of the user's cart",
		});
	}
});

const updateItemQuantity = asyncHandler(async (req, res) => {
	const { _id } = req.user;
	const { cartItemId, quantity } = req.body;
	console.log("backend", cartItemId, quantity);
	try {
		const cartItem = await Cart.findOne({
			userId: _id,
			_id: cartItemId,
		}).populate("productId");
		if (!cartItem || cartItem === "null") {
			return res.status(404).json({ message: "Cart is empty." });
		}
		cartItem.quantity = quantity;
		cartItem.save();
		res.status(200).json(cartItem);
	} catch (error) {
		console.log("error", error);
		res.status(500).json({
			message: "Error Occurred while getting the product of the user's cart",
		});
	}
});

const emptyCart = asyncHandler(async (req, res) => {
	const { _id } = req.user;
	console.log(_id);
	try {
		const user = await User.findOne(_id);
		if (!user) return res.status(404).json({ message: "Not Found!" });
		const productCart = await Cart.findOneAndRemove({ orderby: _id });
		if (!productCart) return res.status(404).json({ message: "empty cart" });
		res.status(200).json(productCart);
	} catch (error) {
		console.log("error", error);
		res.status(500).json({
			message: "Error Occurred while removing the product to the user's cart",
		});
	}
});

export const userInfo = {
	userRegister,
	userLogin,
	getAllUser,
	getUserById,
	deleteUser,
	updatedUser,
	wishList,
	blockUser,
	unBlockUser,
	handleRefreshToken,
	Logout,
	forgotPasswordToken,
	updatePassword,
	verifyRegisterEmail,
	resetPassword,
	saveAddress,
	saveUserOrder,
	getOrder,
	getUserOrders,
	getAllOrders,
	updateOrderStatus,
	deleteOrder,
};
