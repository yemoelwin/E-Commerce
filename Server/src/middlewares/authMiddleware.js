import jwt from 'jsonwebtoken';
// import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';


// const payload = { id: User };
// const secretKey = 'billionaire142996';
// const token = jwt.sign(payload, secretKey);

export const protect = asyncHandler(async (req, res, next) => {
        let token;
        if (
            req.headers.authorization && 
            req.headers.authorization.startsWith("Bearer")
        ) {
            token = req.headers.authorization.split(' ')[1];
            try {
                if (token) {
                    const decoded = jwt.verify(token, process.env.JWT_SECRET);
                    console.log("decoded data", decoded);
                    // console.log(token);
                    const user = await User.findById(decoded.id)
                    req.user = user;
                    if (!req.user) {
                        throw new Error('User Not Found');
                    }
                    next();
                }
            } catch (error) {
                console.log(error);
                res.status(401)
                throw new Error("Not Authorized token expired! Pls login again.")
            }
        } else {
            res.status(401);
            throw new Error('Not Authorized, No Token')
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

// export const isUser = asyncHandler(async (req, res, next) => {
//     const { _id } = req.user; // Assuming `_id` is used to identify users
//     const user = await User.findById(_id);

//     if (!user) {
//         throw new Error('User not found.');
//     } else {
//         req.user = user; // Store user information in the request object
//         next();
//     }
// });


// export const verifyJWT = (token) => {
//     try {
//         const decoded = jwt.verify(token, `${process.env.JWT_SECRET}`)
//     } catch (error) {
        
//     }
// }