import Product from '../models/productModel.js';
import asyncHandler from 'express-async-handler';

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

const createProduct = asyncHandler(async (req, res) => {
    try {
        const { title, description, price, brand, category, quantity, color } = req.body;
        const slug = await generateUniqueSlug(title);
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
        const fetchAllProducts = await Product.find();
        return res.json(fetchAllProducts)
    } catch (error) {
        console.error("Error fetching all products:", error);
        res.status(500).json({
            status: "ERROR",
            message: 'Internal Server Error.'
        })
    }
})



export const productController = { createProduct, getProductById, fetchAllProduct }