// import { query } from 'express';
import Product from '../models/productModel.js';
import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import slugify from 'slugify';
// import cloudinary from '../config/cloudinaryConfig.js';
// import cloudinaryUploadImg from '../config/cloudinaryConfig.js';
// import cloudinaryUploadImg from '../config/cloudinaryConfig.js';
// import path from 'path';
// import fs from 'fs';

const createProduct = asyncHandler(async (req, res) => {
    try {
        const { title, description, price, brand, category, quantity, color } = req.body;
        console.log('Title from req.body:', title);
        if (!title) {
            return res.status(400).json({ message: 'Title is missing or invalid.' });
        }
        // const slug = await generateUniqueSlug(title);
        const slug = slugify(title, { lower: true, strict: true });
        const existingProduct = await Product.findOne({ slug });
        if (existingProduct) {
            return res.status(409).json({
                status: 'FAILED',
                message: 'Product with the same slug already exists.',
            });
        }
        const newProduct = new Product({
            title,
            slug,
            description,
            price,
            brand,
            category,
            quantity,
            color,
        });
        await newProduct.save();
        res.status(200).json({
            message: "Product Created Successfully.",
            product: newProduct
        });

        } catch (error) {
            res.status(500).json({
                status: 'FAILED',
                message: 'Error occurred while creating the product',
                error: error.message
            })
        }
});

const uploadImagesAndFormatSizes = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params; // Get product ID from route params
        const imageFiles = req.files; // Using req.file because you're uploading a multi file
        if (!imageFiles) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        const maxFileSize = 5 * 1024 * 1024; // 5MB
        if (imageFiles.size > maxFileSize) {
            return res.status(400).json({ error: 'File size exceeds the limit' });
        }
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        // Update product images and save
        const uploadedImageUrls = [];
        if (imageFiles !== undefined && imageFiles !== null) {
            for (const file of imageFiles) {                
                const imageInfo = {
                    fileName: file.originalname,
                    filePath: file.path,
                    fileType: file.mimetype,
                    fileSize: fileSizeFormatter(file.size, 2),
                } 
                uploadedImageUrls.push(imageInfo);
            }
            product.images = uploadedImageUrls;
            const productImages = await product.save();
            // Format image sizes        
            return res.status(200).json({
                message: 'Product image updated successfully',
                productImages,
            });
        }
    } catch (error) {
        console.log('error', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

const fileSizeFormatter = (bytes, decimal = 2) => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(decimal)) + ' ' + sizes[i];
}

// const uploadImages = asyncHandler(async (req, res) => {
//     console.log(req.files);
//     const { id } = req.params;
//     try {
//         // const uploadImage = await cloudinary.uploader.upload(req.files)
//         const uploader = async (path) => await cloudinaryUploadImg(path, "images")
//         const urls = [];
//         const files = req.files;
//         console.log('files',files);
//         for (const file of files) {
//             const { path } = file;  
//             console.log('path',path);
//             const newpath = await uploader(path);
//             urls.push(newpath);
//             console.log('newpath', newpath);
//             fs.unlinkSync(path);
//         }
//         const images = await Product.findByIdAndUpdate(id,
//             { images: urls.map((file) => { return file; }) },
//             // { images: urls },
//             { new: true }
//         )
//         res.status(200).json(images)
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({
//             status: 'FAILED',
//             message: 'Error occurred while uploading the product images.',
//             error: error.message
//             })
//     }
// })

const getProductById= async (req, res) => {
    const { id } = req.params;
    // console.log('productid',id);
    try {
        const fetchProduct = await Product.findById( id );
        if (!fetchProduct) {
            return res.status(404).json({
                status: 'FAILED',
                message: 'This item does not exist.'
            })
        }
        res.status(200).json(fetchProduct)
    } catch (error) {
        res.status(500).json({
            status: "ERROR",
            message: 'Internal Server Error.'
        })
    }
}

const fetchAllProduct = asyncHandler(async (req, res) => {
    try {
        const queryObj = { ...req.query };
        const excludeFields = ['page', 'sort', 'limit', 'fields'];
        excludeFields.forEach((element) => delete queryObj[element]);
        console.log(queryObj);
        let queryStr = JSON.stringify(queryObj).replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
        let productQuery = Product.find(JSON.parse(queryStr))

        // sorting
        if (req.query.sort) {
            console.log('sortingResult:',req.query.sort);
            const sortBy = req.query.sort.split(',').join(' ');
            console.log('sortByResult:',sortBy);
            productQuery = productQuery.collation({ locale: 'en', caseLevel: false }).sort(sortBy)
            // console.log('productQueryResult:',productQuery);
        } else {
            productQuery = productQuery.sort({ createdAt: -1 });
        }

        // limiting the fields
        if (req.query.fields) {
            const fields = req.query.fields.split(',').join(' ');
            console.log('fields', fields);
            productQuery = productQuery.select(fields)
        } else{
            productQuery = productQuery.select('-__v')
        }

        // pagination
        const page = req.query.page;
        const limitProduct = req.query.limit;
        const skip = (page - 1) * limitProduct;
        productQuery = productQuery.skip(skip).limit(limitProduct)
        if (req.query.page) {
            const productCount = await Product.countDocuments();
            if (skip >= productCount) {
                return res.status(404).json({
                    status: 'FAILED',
                    message: 'The requested page is not found.'
                })
            }
        }
        console.log(skip);
        
        const products = await productQuery;
        res.json(products);
    } catch (error) {
        console.error("Error fetching all products:", error);
        res.status(500).json({
            status: "ERROR",
            message: 'Internal Server Error.'
        })
    }
})

const updateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const { title } = req.body;
        console.log('Request body:', req.body);
        console.log('Title:', title);
        if (typeof title !== 'string' || !title.trim()) {
            return res.status(400).json({ message: 'Invalid or missing title.' });
        }
        const slug = slugify(title, { lower: true, strict: true });
        req.body.slug = slug;
        const updatedProduct = await Product.findOneAndUpdate({ _id: id }, req.body, { new: true })
        if (!updatedProduct) {
            return res.status(404).json({
                status: 'FAILED',
                message: 'No product found.'
            });
        }
        res.status(200).json({
            product: updatedProduct,
            status: 'SUCCESS',
            message: 'Product successfully updated.'
        })
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({
            status: 'ERROR',
            message: 'Internal Server Error. Please try again.'
        })
    }
})

const deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findOneAndDelete({ _id: id })
        if (!product) {
            res.status(404).json({
                status: 'FAILED',
                message: 'No product found.'
            })
        }
        res.status(200).json({
            status: 'SUCCESS',
            message: 'Successfully deleted.',
            product: product
        })
    } catch (error) {
        res.status(500).json({
            status: 'ERROR OCCURRED',
            message: 'Something went wrong. Please try again.'
        })
    }
})

const addToWishlist = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { prodId } = req.body;
    try {
        const user = await User.findById(_id);
        console.log("user", user);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        const alreadyAdded = user.wishlist.includes(prodId);
        // const alreadyAdded = user.wishlist.find((id) => id.toString() === prodId.toString());

        await User.findByIdAndUpdate(_id )
        if (alreadyAdded) {
            const updatedUser = await User.findByIdAndUpdate(
                _id,
                { $pull: { wishlist: prodId } },
                { new: true });
            res.json({ message: 'Product removed from wishlist.', updatedUser });
        } else {
            const updatedUser = await User.findByIdAndUpdate(
                _id,
                { $push: { wishlist: prodId } },
                { new: true }
            );
            res.json({ message: 'Product added to wishlist.', updatedUser });
        }
    } catch (error) {
        res.status(500).json({ message: "Error Occurred while adding the product to the user's wishlist" });
    }
})

const starRating = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    console.log('_id', _id);
    const { stars, prodId, comment } = req.body;
    console.log('star n prodId', stars, prodId);
    try {
        const product = await Product.findById(prodId);
        if (!product) return res.status(404).json({ message: 'product not found!' });
        let alreadyRated = product.ratings.find(userId => userId.postedby.toString() === _id.toString());
        if (alreadyRated) {
            await Product.updateOne(
                {
                    ratings: { $elemMatch: alreadyRated }
                },
                {
                    $set: { "ratings.$.stars": stars, "ratings.$.comment": comment }
                },
                { new: true }
            );
        } else {
            await Product.findByIdAndUpdate(
                prodId,
                {
                    $push: {
                        ratings: {
                            stars: stars,
                            comment: comment,
                            postedby: _id
                        }
                    }
                },
                { new: true }
            );
        }
        const getAllRatings = await Product.findById(prodId);
        let totalRating = getAllRatings.ratings.length;
        console.log('totalRating', totalRating);
        let sumRating = getAllRatings.ratings
            .map(product => product.stars)
            .reduce((prev, current) => prev + current, 0);
        console.log('sumRating', sumRating);
        let actualRating = Math.round(sumRating / totalRating);
        // let actualRating = Math.round(9 / 2);
        console.log('actualRating', actualRating);
        let updatedProduct = await Product.findByIdAndUpdate(prodId,
            {
            totalrating: actualRating
            },
            { new: true }
        )
        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: "Error Occurred while rating stars." });
    }
});

const filterProduct = asyncHandler(async (req, res) => {
    const { miniprice, maxprice, color, brand, category, availability } = req.params;
    console.log(req.query);
    try {
        const filterProduct = await Product.find({
            price: {
                $gte: miniprice,
                $lte: maxprice,
            },
            category,
            brand,
            color,
        });
        res.json(filterProduct)
    } catch (error) {
        res.status(500).json({
            status: 'ERROR',
            message: 'Internal Server Error and try again.'
        })
    }
})

export const productController = { createProduct, getProductById, fetchAllProduct, deleteProduct, addToWishlist, updateProduct, starRating, uploadImagesAndFormatSizes };


// const generateUniqueSlug = async (title) => {
//     // if (typeof title === 'string') {
//         let slug = title?.toLowerCase()?.replace(/[^a-z0-9\s]/g, "");
//         slug = slug.replace(/\s+/g, "-");
//         const existingProduct = await Product.findOne({ slug });
//         if (existingProduct) {
//             const randomString = Math.random().toString(36).substr(2, 5);
//             slug += `-${randomString}`;
//         }
//         return slug;
//     // } 
// }

// if (req.body.title){
//     req.body.slug = slugify(req.body.title)
// }