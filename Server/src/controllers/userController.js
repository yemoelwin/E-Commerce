import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import asyncHandler from 'express-async-handler';
import { generateAccessToken } from '../config/jwtToken.js';
import { generateRefreshToken } from '../config/refreshToken.js';
import { validateMongodbID } from '../utils/validateMongodbID.js';
import jwt from 'jsonwebtoken';

import path from 'path';

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
            password: hashedPassword
        })
        await newUser.save()
        res.status(200).json(newUser)
    }
    catch (error) {
        res.status(400).json({
        status: 'FAILED',
        message: error.message
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

export const userInfo = { userRegister, userLogin, getAllUser, getUserById, deleteUser, updatedUser, blockUser, unBlockUser, handleRefreshToken, Logout };