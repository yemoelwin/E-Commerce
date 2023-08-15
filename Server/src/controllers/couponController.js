import asyncHandler from 'express-async-handler';
import User from '../models/blogCategory.js';
import couponModel from '../models/couponModel.js';
import coupongenerator from '../config/couponGenerator.js';
import { validateMongodbID } from "../utils/validateMongodbID.js";

const createCoupon = asyncHandler(async (req, res) => {
    let couponCode;
    let isUnique = false;
    try {
        while (!isUnique) {
            couponCode = coupongenerator(20);
            console.log('couponCode', couponCode);
            const existingCoupon = await couponModel.findOne({ code: couponCode })
            if (!existingCoupon) {
                isUnique = true;
            }
            console.log('existCoupon', existingCoupon);
        }
        const createCouponData = {
            code: couponCode,
            expiry: req.body.expiry, // Make sure to provide expiry in the request body
            discount: req.body.discount
        }
        console.log('createCouponData', createCouponData);
        const createdCoupon = await couponModel.create(createCouponData);
        console.log('createdCoupon',createdCoupon);
        return res.status(200).json(createdCoupon);
    } catch (error) {
        console.log('error',error);
        res.status(500).json({ message: 'Error occurred while creating coupon.'})
    }
});

// const generateAndSaveDiscountCode = asyncHandler(async (req, res) => {
//     try {
//         let isExistDiscount = false;
//         let generatedDiscountCode;
//         do {
//             let myDiscountCode = coupongenerator(15);
//             let newDicountCode = new couponModel({
//                 code: myDiscountCode,
//                 isPercent: false,
//                 amount: 100,
//                 expiry: new Date(),
//                 discount: 20,
//                 isActive: true
//             });
//             try {
//                 const savedDiscountCode = await newDicountCode.save();
//                 generatedDiscountCode = savedDiscountCode.code;
//             } catch (error) {
//                 if (err.name === 'MongoError' && err.code === 11000) {
//                     isExistDiscount = true;
//                 } else {
//                     console.error(err);
//                     return res.status(500).send({
//                         success: false,
//                         message: 'Internal server error'
//                     });
//                 }
//             }
//         } while (isExistDiscount);
//         return res.status(200).json({
//             success: true,
//             message: 'Discount code generated successfully',
//             code: generatedDiscountCode
//         })
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({
//             success: false,
//             message: 'Internal server error'
//         });
//     }
// })

const getAllCoupon = asyncHandler(async (req, res) => {
    try {
        const getAllCoupon = await couponModel.find();
        res.status(200).json(getAllCoupon);
    } catch (error) {
        res.status(500).json({ message: 'Error occurred while getting all coupon.'})
    }
});

const getCoupon = asyncHandler(async (req, res) => {
    const { _id } = req.params;
    try {
        const getCoupon = await couponModel.findById(_id);
        if (!getCoupon || getCoupon === null) {
            return res.status(404).json({ message: 'No coupon found.' });
        }
        const currentDate = new Date();
        if (getCoupon.expiry && currentDate > getCoupon.expiry) {
            return res.status(200).json({ message: 'Coupon has expired.' });
        }
        res.status(200).json(getCoupon);
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(404).json({ message: 'No coupon found.' });
        }
        res.status(500).json({ message: 'Error occurred while getting all coupon.'})
    }
});

const deleteCoupon = asyncHandler(async (req, res) => {
    const { _id } = req.params;
    try {
        const getCoupon = await couponModel.findByIdAndDelete(_id);
        if (!getCoupon || getCoupon === null) {
            return res.status(404).json({ message: 'No coupon found.' });
        }
        res.status(200).json({message: 'Successfully deleted.', getCoupon});
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(404).json({ message: 'No coupon found.' });
        }
        res.status(500).json({ message: 'Error occurred while getting all coupon.'})
    }
})

export const couponInfo = { createCoupon, getAllCoupon, getCoupon, deleteCoupon }