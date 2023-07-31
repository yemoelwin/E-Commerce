import User from '../models/userModel.js';
import UserVerification from '../models/userVerification.js';
import UserPasswordVerification from '../models/passwordVerification.js';
import { sendVerificationEmail, ResetPasswordToken } from '../config/EmailVerify.js';
import bcrypt from 'bcryptjs';
import asyncHandler from 'express-async-handler';
import { generateAccessToken } from '../config/jwtToken.js';
import { generateRefreshToken } from '../config/refreshToken.js';
import { validateMongodbID } from '../utils/validateMongodbID.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto'

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
    let { userId, uniqueString } = req.params;
    try {
        const verificationData = await UserVerification.findOne({
            userId, 
            uniqueString,
            expiredAt: { $gt: Date.now()}
        })
        if (!verificationData) {
            return res.status(400).json({
                status: 'FAILED',
                message: 'Invalid or expired verification link.'
            });
        }
        await User.findByIdAndUpdate({ _id: userId }, { $set: { verified: true } }, { new: true });
        return res.status(200).json({
            status: 'SUCCESS',
            message: 'Email verification successful. You can now log in.'
        });
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
        
    }
})

export const userInfo = { userRegister, userLogin, getAllUser, getUserById, deleteUser, updatedUser, blockUser, unBlockUser, handleRefreshToken, Logout, verifyResetToken, forgotPasswordToken, updatePassword, verifyRegisterEmail, resetPassword};