import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import { config } from 'dotenv';
config();

export const protect = asyncHandler(async (req, res, next) => {
    let token;
        if (
            req.headers.authorization && 
            req.headers.authorization.startsWith("Bearer")
        ) {
            // token = req.headers.authorization;
            token = req.headers.authorization.split(' ')[1];
            console.log('authorization Token', token)
            try {
                if (token) {
                    const decoded = jwt.verify(token, process.env.JWT_SECRET);
                    console.log("decoded data", decoded);
                    const user = await User.findById(decoded.id);
                    console.log('req user checking by token', user);
                    req.user = user;
                    if (!req.user) {
                        throw new Error('User Not Found');
                    }
                    if (user === 'token expired') {
                        return res.status(401).json({ message: 'error', data: "token expired" });
                    }
                    next();
                }
            } catch (error) {
                if (error.name === 'TokenExpiredError') {
                    res.status(401).json({ message: 'error', data: 'Token expired' });
                } else {
                    console.log(error);
                    res.status(401).json({ message: 'error', data: 'Not Authorized, Invalid Token' });
                }
            }
        } else {
            res.status(401).json({ message: 'error', data: 'Not Authorized, No Token' });
        }
    }
)

export const isAdmin = asyncHandler(async (req, res, next) => {
    const { email } = req.user;
    const adminUser = await User.findOne({email})
    if (adminUser.role !== 'admin') {
        throw new Error('You are not authorized.Admin only have authorization to access.')
    } else {
        next()
    }
})

