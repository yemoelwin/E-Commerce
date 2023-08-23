import User from '../models/userModel.js';
import Product from '../models/productModel.js';
import Cart from '../models/cartModel.js';
import Coupon from '../models/couponModel.js';
import Order from '../models/orderModel.js';
import UserVerification from '../models/userVerification.js';
import UserPasswordVerification from '../models/passwordVerification.js';
import { sendVerificationEmail, ResetPasswordToken } from '../config/EmailVerify.js';
import bcrypt from 'bcryptjs';
import asyncHandler from 'express-async-handler';
import { generateAccessToken } from '../config/jwtToken.js';
import { generateRefreshToken } from '../config/refreshToken.js';
import { validateMongodbID } from '../utils/validateMongodbID.js';
import jwt from 'jsonwebtoken';
import uniqid from 'uniqid';
import { config } from 'dotenv';
config();
// import crypto from 'crypto'
// import { generatePasswordResetToken } from '../models/userModel.js';

const userRegister = asyncHandler(async (req, res) => {
    try {
        // Extract the required fields from the request body
        const { firstname, lastname, email, mobile, password } = req.body;
        const existingUser = await User.findOne({ $or: [{ email }, { mobile }] })
        if (existingUser) {
            throw new Error('User with this email or phone number already exists! ')
        }
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds)
        const newUser = new User({
            firstname,
            lastname,
            email,
            mobile,
            password: hashedPassword,
            verified: false
        })
        if (email === 'yemoelwin142@gmail.com') {
            newUser.role = 'admin'; // Set role to admin for specific email
        }
        const savedUser = await newUser.save();
        await sendVerificationEmail(savedUser, res);
        res.status(200).json(newUser)
    }
    catch (error) {
        res.status(400).json({
        status: 'FAILED',
        message: error.message
    });
    }
})

const verifyRegisterEmail = asyncHandler(async (req, res) => {
    let { token, _id } = req.params;
    console.log('Received userId from route params:', _id);
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (_id !== decoded._id) {
            return res.status(400).json({ message: 'Invalid user ID.' });
        }
        console.log('decode', decoded);
        const verificationRecord = await UserVerification.findOne(
            {
                userId: _id,
                token,
                expiredAt: { $gt: Date.now()}
            });
        console.log('verificationRecord', verificationRecord);
        console.log('Current timestamp:', Date.now());
        // console.log('Expired timestamp:', verificationRecord.expiredAt);
        if (!verificationRecord) {
            return res.status(400).json({
                    status: 'FAILED',
                    message: 'Invalid or expired verification link.'
                });
        }
        await User.findByIdAndUpdate(
            _id,
            { $set: { verified: true } },
            { new: true }
        );
        // await UserVerification.findOneAndDelete({ userId, uniqueString: token });
        return res.json({ message: 'Email verified successfully.You can login now.' });
    } catch (error) {
        console.error('Error during email verification:', error);
        res.status(500).json({
            status: 'FAILED',
            message: 'An error occurred during email verification. Please try again later.'
        });
    }
})

const userLogin = asyncHandler(async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email })
        if (!user) {
            res.status(404).json({
                status: 'FAILED',
                message: 'This user account does not exists.'
            })
            return;
        }
        if (user.verified === false) {
            return res.status(403).json({
                status: 'FAILED',
                message: 'You need to verify your email.'
            })
        }
        const isMatched = await bcrypt.compare(password, user.password)
        // console.log(isMatched);
        if (isMatched) {
            const refreshToken = generateRefreshToken(user?._id);
            const updatedUser = await User.findByIdAndUpdate(user._id, {
                refreshToken
            }, {
                new: true
            })
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                maxAge: 72 * 60 * 60 * 1000
            })
            res.status(200).json({
                _id: user?._id,
                firstname: user?.firstname,
                lastname: user?.lastname,
                email: user?.email,
                role: user?.role,
                token: generateAccessToken(user?._id),
                status: 'SUCCESS',
                message: 'User logged in successfully',
            });
        } else {
            res.status(401).json({
                status: 'FAILED',
                message: 'Invalid Password'
            })
        }
    } catch (error) {
        res.status(500).json({
            status: 'FAILED',
            message: 'An error occurred while login and pls try again.'
        })
    }
})

const adminLogin = asyncHandler(async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await User.findOne({ email });
        if (!admin) {
            return res.status(404).json({
                status: 'FAILED',
                message: 'This admin account does not exists.'
            })
        }
        if (!admin?.verified) {
            return res.status(403).json({
                status: 'FAILED',
                message: 'You need to verify your email.'
            })
        }
        if (admin.role !== 'admin') return res.status(404).json({ status: 'FAILED', message: 'Not Authorised' });
        // if (admin && (await admin.password(admin.password,password))) {
        const isMatched = await bcrypt.compare(password, admin.password)
        if (!isMatched) {
            return res.status(404).json({ status: 'FAILED', message: 'Password does not match!' });
        }
            const refreshToken = await generateRefreshToken(admin?._id);
            await User.findByIdAndUpdate(
                admin?.id,
                {
                    refreshToken: refreshToken
                },
                { new: true }
            )
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                maxAge: 72 * 60 * 60 * 1000
            })
            res.status(200).json({
                _id: admin?._id,
                firstname: admin?.firstname,
                lastname: admin?.lastname,
                email: admin?.email,
                role: admin.role,
                token: generateAccessToken(admin?._id),
                status: 'SUCCESS',
                message: 'User logged in successfully',
            });
        // } else {
        //     return res.status(404).json({ message: 'Invalid Credetials.' })
        // }
    } catch (error) {
        res.status(500).json({
            status: 'FAILED',
            message: 'An error occurred while login as admin and pls try again.'
        })
    }
})

const Logout = asyncHandler(async (req, res) => {
    try {
        const cookie = req.cookies;
        if (!cookie?.refreshToken) throw new Error('No Refresh Token in Cookies.');
        const refreshToken = cookie.refreshToken;
        const user = await User.findOne({ refreshToken });
        if (!user) {
            res.clearCookie('refreshToken', {
                httpOnly: true,
                secure: true,
            })
            return res.sendStatus(403) /* forbidden */
        }
        await User.findOneAndUpdate({ refreshToken: refreshToken },{ refreshToken: " "});
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: true
        });
        res.status(200).json('Logged out successfully.');
    } catch (error) {
        console.log(error);
        res.status(500).json('Internal Server Error.')
    }
})

const handleRefreshToken = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    console.log(cookie);
    if (!cookie?.refreshToken) throw new Error('Pls try logging in again to authenticate.')
    const refreshToken = cookie.refreshToken;
    console.log(refreshToken);
    const user = await User.findOne({ refreshToken });
    if (!user) throw new Error('No refresh token present in db or not matched.')
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
        console.log(decoded);
        if (err || user.id !== decoded.id) {
            throw new Error('There is something wrong with refresh token')
        }
        const accessToken = generateAccessToken(user?._id);
        res.json({accessToken})
    })
})

const verifyResetToken = asyncHandler(async (req, res) => {
    const { userId, uniqueToken } = req.params;
    console.log('userId', userId);
    console.log('resetPasswordToken', uniqueToken);
    try {
        const verifyResetToken = await UserPasswordVerification.findOne({
            userId,
            uniqueToken,
            uniqueTokenExpiredAt: { $gt: Date.now() }
        })
        console.log('verifyResetToken', verifyResetToken);
        if (!verifyResetToken) {
            return res.status(400).json({
                status: 'FAILED',
                message: 'Invalid or expired reset password token.'
            });
        }
        res.status(200).json({message: 'enter your new password.'})
    } catch (error) {
        console.error('Error resetting email password :', error);
        res.status(500).json({
            status: 'FAILED',
            message: 'An error occurred during password reset. Please try again later.'
        });
    }
})

const resetPassword = asyncHandler(async (req, res) => {
    try {
        const { userId, uniqueToken } = req.params;
        const { newPassword } = req.body;
        if (!newPassword) {
            return res.status(400).json({
                status: 'FAILED',
                message: 'New password is missing in the request body.',
            });
        }
        const verificationData = await UserPasswordVerification.findOne({
            userId,
            uniqueToken,
            uniqueTokenExpiredAt: { $gt: Date.now() }, // Check if token is not expired
        });
        if (!verificationData) {
        return res.status(400).json({
            status: 'FAILED',
            message: 'Invalid or expired reset token.',
        });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 12);
        const updatedUser = await User.findById(userId);
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found.' });
        }
        updatedUser.password = hashedPassword;
        updatedUser.passwordChangedAt = new Date();
        await updatedUser.save();
        console.log('updatedUser', updatedUser);
        res.status(200).json({
            status: 'SUCCESS',
            message: 'Password reset successful. You can now log in with your new password.',
        });
    } catch (error) {
        res.status(500).json({
            status: 'FAILED',
            message: 'An error occurred during password reset.',
        });
    }
});
// const validatePasswordToken = asyncHandler(async (req, res) => {
//     try {
//         const { email, resetToken, newPassword } = req.body;
//         const user = await User.findOne({ email })
//         if (!user) return res.status(404).json({ message: 'User not found.' });
//         if (!user.validatePasswordResetToken(resetToken)) {
//             return res.status(401).json({
//                 status: 'FAILED',
//                 message: 'Invalid or expired reset token. Please request a new reset link.',
//             });
//         }
//         const hashedPassword = await bcrypt.hash(newPassword, 12);
//         user.password = hashedPassword;
//         user.passwordResetToken = undefined;
//         user.passwordResetTokenExpires = undefined;
//         await user.save();
//         res.status(200).json({
//             status: 'SUCCESS',
//             message: 'Password reset successful. You can now log in with your new password.',
//         });
//     } catch (error) {
//         res.status(500).json({
//             status: 'FAILED',
//             message: 'An error occurred while resetting the password. Please try again.',
//         });
//     }
// })

const forgotPasswordToken = asyncHandler(async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found.' });
        const resetToken = await ResetPasswordToken({ _id: user._id, email });
        res.status(200).json(resetToken);
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while processing the password reset request. Please try again.' });
    }
})

const updatePassword = asyncHandler(async (req, res) => {
    console.log('req',req);
    try {
        const { userId, oldPassword, newPassword } = req.body;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found.' });
        const isPasswordMatched = await bcrypt.compare(oldPassword, user.password);
        if (!isPasswordMatched) return res.status(400).json({ message: 'Invalid old password.' });
        const updatedPassword = await bcrypt.hash(newPassword, 12)
        user.password = updatedPassword;
        user.passwordChangedAt = new Date();
        await user.save();
        res.status(200).json({ message: 'Password updated successfully.' })
    } catch (error) {
        res.status(500).json({ message: 'Internal server error.' });
    }
})

const saveAddress = asyncHandler(async (req, res) => {
    const { _id } = req.params;
    console.log('userId', _id);
    try {
        const updatedUser = await User.findByIdAndUpdate(
            _id,
            {
                address: req?.body.address
            },
            { new: true }
        )
        console.log('updatedUser', updatedUser);
        res.status(200).json(updatedUser)
    } catch (error) {
        res.status(500).json({ message: 'Internal server error.' });
    }
})

const getAllUser = asyncHandler(async (req, res) => {
    try {
        const getUsers = await User.find();
        res.json(getUsers)
    } catch (error) {
        throw new Error(error)
    }
})

const getUserById = asyncHandler(async (req, res) => {
    const { id } = req.user;
    validateMongodbID(id)
    try {
        const user = await User.findById(id)
        if (!user) {
            return res.status(404).json({
                message: 'User Not Found!'
            })
        }
        res.json({
            user
        })
    } catch (error) {
        throw new Error(error)
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
})

const updatedUser = asyncHandler(async (req, res) => {
    const { id } = req.user;
    validateMongodbID(id)
    console.log('requser',req.user);
    try {
        const updatedUser = await User.findByIdAndUpdate(id, {
            firstname: req?.body?.firstname,
            lastname: req?.body?.lastname,
            email: req?.body?.email,
            mobile: req?.body?.mobile,
            password: req?.body?.password
        }, {
            new: true
        })
        res.json(updatedUser)
    } catch (error) {
        throw new Error(error)
    }
})

const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbID(id)
    try {
        const user = await User.findByIdAndDelete(id)
        if (!user) {
            return res.status(404).json({
                status: "FAILED",
                message: "User not found."
            })
        }
        res.status(200).json({
            status: "SUCCESS",
            message: "User successfully deleted."
        })
    } catch (error) {
        res.status(500).json({
            status: 'FAILED',
            message: 'An error occurred while deleting and pls try again.'
        })
    }
})
        
const blockUser = asyncHandler(async(req, res) => {
    try {
        const { id } = req.params;
        const blockuser = await User.findByIdAndUpdate(id,
            {
            isBlocked : true
            },
            {
                new: true
            }
        )
        res.status(200).json({
            blockuser,
            status: 'SUCCESS',
            message: 'Successfully blocked.'
        });
    } catch (error) {
        res.status(500).json({
            status: "FAILED",
            message: 'An error occurred and try again.'
        })
    }
})

const unBlockUser = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const unblockuser = await User.findByIdAndUpdate(id,
            {
                isBlocked: false
            },
            {
                new: true
            }
        )
        res.status(200).json({
                unblockuser,
                status: 'SUCCESS',
                message: 'This user is no longer blocked and now access and authorization to their corresponding part.'
            })
    } catch (error) {
        res.status(500).json({
            status: "FAILED",
            message: 'An error occurred and try again.'
        })
    }
})

const getWishlist = asyncHandler(async (req, res) => {
    const { _id } = req.params;
    let wishlistData = [];
    try {
        const user = await User.findById(_id);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        if (user.role === 'admin') {
            wishlistData = await User.populate(user, {
                path: 'wishlist',
                select: '-__v'
            });
        } else {
            wishlistData = await User.populate(user, {
                path: 'wishlist',
                select: 'title price description brand category quantity images color totalratings'
            });
        };
        const userData = {
            _id: user._id,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            wishlist: wishlistData.wishlist
        };
        res.status(200).json({ message: 'user wishlist', user: userData });
    } catch (error) {
        console.log('error', error);
        res.status(500).json({
            status: "FAILED",
            message: 'An error occurred while getting wishlist.'
        })
    }
})

const addToCart = asyncHandler(async (req, res) => {
    const { cart } = req.body;
    const { _id } = req.user;
    try {
        const user = await User.findById(_id)
        if (!user) {
            return res.status(404).json({ message: 'Error'})
        }
        let products = [];
        await Cart.findOneAndDelete({ orderby: user._id })
        for (let i = 0; i < cart.length; i++){
            let object = [];
            object.product = cart[i]._id;
            object.count = cart[i].count;
            object.color = cart[i].color;
            let getPrice = await Product.findById(cart[i]._id).select('price').exec();
            object.price = getPrice.price;
            products.push(object)
        }
        let cartTotalPrice = 0;
        for (let i = 0; i < products.length; i++){
            cartTotalPrice += products[i].price * products[i].count;
        }
        let newCart = new Cart({
            products,
            cartTotalPrice,
            orderby: user?._id
        })
        await newCart.save();
        res.status(200).json({ message: 'Items have been added to your cart.', newCart})
        console.log("products and cartTotal", products, cartTotal);
    } catch (error) {
        console.log('error', error);
        res.status(500).json({ message: "Error Occurred while adding the product to the user's cart" });
    }
})

const getUserCart = asyncHandler(async (req, res) => {
    const { _id } = req.params;
    try {
        const cart = await Cart.findOne({ orderby: _id })
            .populate('products.product', "_id color title brand totalAfterDiscount")
        if (!cart || cart === 'null') {
            return res.status(404).json({ message: 'Cart is empty.' })
        }
            // .populate({
            //     path: 'products.product',"_id color totalAfterDiscount"
            //     // select: '-ratings -slug -category -price -sold -totalratings -createdAt -updatedAt -quantity -images'
            // });
        res.status(200).json(cart)
    } catch (error) {
        console.log('error', error);
        res.status(500).json({ message: "Error Occurred while getting the product of the user's cart" });
    }
})

const emptyCart = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    console.log(_id);
    try {
        const user = await User.findOne(_id);
        if (!user) return res.status(404).json({ message: 'Not Found!' })
        const productCart = await Cart.findOneAndRemove({ orderby: _id })
        if (!productCart) return res.status(404).json({ message: 'empty cart' })
        res.status(200).json(productCart)
    } catch (error) {
        console.log('error', error);
        res.status(500).json({ message: "Error Occurred while removing the product to the user's cart" });
    }
})

const applyCoupon = asyncHandler(async (req, res) => {
    const { couponId } = req.body;
    const { _id } = req.user;
    try {
        const validCoupon = await Coupon.findOne({ code: couponId });
        if (!validCoupon) {
            return res.status(400).json({ message: 'Invalid coupon code. Coupon not found.' });
        }
        const cart = await Cart.findOne({ orderby: _id })
        let cartTotalPrice = cart.cartTotalPrice;
        let totalAfterDiscount = (
            cartTotalPrice - (cartTotalPrice * validCoupon.discount) / 100
        ).toFixed(2);
        await Cart.findOneAndUpdate(
            { orderby: _id },
            { totalAfterDiscount },
            { new: true }
        )
        return res.status(200).json(
            {
                message: 'Coupon applied successfully.',
                totalBeforeDiscount: cartTotalPrice.toFixed(2),
                totalAfterDiscount
            })
    } catch (error) {
        console.log('error', error);
        res.status(500).json({ message: "Error Occurred while applying the coupon." });
    }
})

const creatOrder = asyncHandler(async (req, res) => {
    const { COD, couponApplied, Prepaid } = req.body;
    console.log("prepaid",Prepaid);
    const { _id } = req.user;
    try {
        if (!COD && !Prepaid) {
            return res.status(500).json({ message: 'Failed.'})
        }
        const user = await User.findById(_id);
        const userCart = await Cart.findOne({ orderby: user._id })
        console.log('userCart',userCart);
            // .populate("products.product", "_id color title price brand totalAfterDiscount")
        let finalAmount = 0;
        if (couponApplied && userCart.totalAfterDiscount) {
            finalAmount = userCart.totalAfterDiscount
        } else {
            finalAmount = userCart.cartTotalPrice
        }
        const paymentMethod = COD ? "COD" : "Prepaid";
        const orderStatus = COD ? "Cash on Delivery" : "Prepaid";
        const newOrder = new Order({
            products: userCart.products,
            payment: [{
                id: uniqid(),
                method: paymentMethod,
                amount: finalAmount,
                status: orderStatus,
                createdAt: new Date(),
                currency: 'usd'
            }],
            orderby: user._id,
            orderStatus: orderStatus
        })
        await newOrder.save();
        const bulkWriteOperations = userCart.products.map((item) => ({
            updateOne: {
                filter: { _id: item.product._id },
                update: { $inc: { quantity: -item.count, sold: +item.count } },
            },
        }));
        await Product.bulkWrite(bulkWriteOperations, {});
        res.json({ message: "Order created successfully." });
    } catch (error) {
        console.log('error', error);
        res.status(500).json({ message: "Error Occurred while creating ordering." });
    }
})

const userOrders = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    try {
        const userOrders = await Order.findOne({ orderby: _id })
        .populate('products.product', "_id color title brand description").exec()
        res.status(200).json(userOrders);
    } catch (error) {
        console.log('error', error);
        res.status(500).json({ message: "Error Occurred while retrieving user orders." });
    }
})

const updateOrderStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const { id } = req.params;
    validateMongodbID(id);
    try {
        const updateOrderStatus = await Order.findByIdAndUpdate(
        id,
        {
            orderStatus: status,
            payment: {
            status: status,
            },
        },
        { new: true }
        );
        res.json(updateOrderStatus);
    } catch (error) {
        console.log('error', error);
        res.status(500).json({ message: "Error Occurred while ordering." });
    }
});


export const userInfo = { userRegister, userLogin, getAllUser, getUserById, deleteUser, updatedUser, blockUser, unBlockUser, handleRefreshToken, Logout, verifyResetToken, forgotPasswordToken, updatePassword, verifyRegisterEmail, resetPassword, adminLogin, getWishlist, saveAddress, addToCart, getUserCart, emptyCart, applyCoupon, creatOrder, userOrders, updateOrderStatus };









        // wishlistData = user.wishlist.map(product => ({
        //         _id: product._id,
        //         title: product.title,
        //         price: product.price,
        //         description: product.description,
        //         brand: product.brand,
        //         category: product.category,
        //         quantity: product.quantity,
        //         color: product.color,
        //         images: product.images,
        //         totalratings: product.totalratings
        //     }));
        // }

        // const userData = {
        //     _id: user._id,
        //     firstname: user.firstname,
        //     lastname: user.lastname,
        //     email: user.email,
        //     mobile: user.mobile,
        //     wishlist: wishlistData
        // };