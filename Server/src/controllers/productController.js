// import { query } from 'express';
import Product from '../models/productModel.js';
import asyncHandler from 'express-async-handler';
import slugify from 'slugify'

const generateUniqueSlug = async (title) => {
    let slug = title.toLowerCase().replace(/[^a-z0-9\s]/g, "");
    slug = slug.replace(/\s+/g, "-");
    const existingProduct = await Product.findOne({ slug });
    if (existingProduct) {
        const randomString = Math.random().toString(36).substr(2, 5);
        slug += `-${randomString}`;
    }
    return slug;
}

// if (req.body.title){
//     req.body.slug = slugify(req.body.title)
// }

const createProduct = asyncHandler(async (req, res) => {
    try {
        const { title, description, price, brand, category, quantity, color } = req.body;
        const slug = await generateUniqueSlug(title);
        const existingProduct = await Product.findOne({ slug });
        if (existingProduct) {
            return res.status(409).json({
                status: 'FAILED',
                message: 'Product with the same slug already exists.',
            });
        }
        const newProduct = new Product({
            title,
            slug: slug,
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
        })
    } catch (error) {
        res.status(500).json({
            status: 'FAILED',
            message: 'Error occurred while creating the product',
            error: error.message
        })
    }
});

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
        const slug = await generateUniqueSlug(req.body.title);
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

export const productController = { createProduct, getProductById, fetchAllProduct, updateProduct, deleteProduct };