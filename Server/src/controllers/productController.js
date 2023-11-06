import Product from '../models/productModel.js';
import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import slugify from 'slugify';


const createProduct = asyncHandler(async (req, res) => {
    try {
        const { title, description, price, brand, category, quantity, color, images, tags } = req.body;
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
            images,
            tags,
        });
        console.log('newProduct', newProduct);
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

// const uploadImages = asyncHandler(async (req, res) => {
//     try {
//         const uploader = async (path) => await cloudinaryUploadImg(path, "images")
//         const urls = [];
//         const files = req.files;
//         for (const file of files) {
//             const { path } = file;
//             const newpath = await uploader(path);
//             urls.push(newpath);
//             fs.unlinkSync(path);
//         }
//         const images = urls.map((file) =>{
        //    return file
//          })
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

const getProductById = async (req, res) => {
    const { id } = req.params;
    console.log('backendProdId', id)
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

const searchProducts = asyncHandler(async (req, res) => {
    try {
        const searchQuery = req.query.query;
        console.log('searchQueryBackend', searchQuery);
        const priceQuery = !isNaN(searchQuery) ? { price: searchQuery } : null;
        const filteredProducts = await Product.find({
            $or: [
                { title: { $regex: searchQuery, $options: 'i'}},
                { brand: { $regex: searchQuery, $options: 'i'}},
                { category: { $regex: searchQuery, $options: 'i'}},
                priceQuery,
            ].filter(Boolean)
        })
        res.status(200).json(filteredProducts);
    } catch (error) {
        console.error("Error searching products:", error);
        res.status(500).json({
            status: "ERROR",
            message: 'Internal Server Error.'
        });
    }
})

const updateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { title, description, price, brand, category, quantity, color, images, tags } = req.body;
    try {
        // console.log('Request body:', req.body);
        if (typeof title !== 'string' || !title.trim()) {
            return res.status(400).json({ message: 'Invalid or missing title.' });
        }
        const slug = slugify(title, { lower: true, strict: true });
        req.body.slug = slug;
        const product = await Product.findByIdAndUpdate(
            id,
            { title, description, price, brand, category, quantity, color, images, tags, slug },
            { new: true }
        )
        if (!product) {
            return res.status(404).json({
                status: 'FAILED',
                message: 'No product found.'
            });
        }
        res.status(200).json({
            product: product,
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
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        const alreadyAdded = user.wishlist.includes(prodId);
        // const alreadyAdded = user.wishlist.find((id) => id.toString() === prodId.toString());

        await User.findByIdAndUpdate(_id )
        if (alreadyAdded) {
            res.json({ message: 'Product already exists in the wishlist.' });
        } else {
            const updatedItemWishlist = await User.findByIdAndUpdate(
                _id,
                { $push: { wishlist: prodId } },
                { new: true }
            );
            res.json({ message: 'Product added to wishlist.', updatedItemWishlist });
        }
    } catch (error) {
        res.status(500).json({ message: "Error Occurred while adding the product to the user's wishlist" });
    }
})

const removeFromWishlist = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { prodId } = req.body;
    try {
        const user = await User.findById(_id);
        if (!user) return res.status(404).json({ message: 'User does not exists.' });
        const findItemIndex = user.wishlist.indexOf(prodId);
        if (findItemIndex === -1) return res.status(404).json({ message: 'Item not found in the wishlist.' });

        // Remove the product from the wishlist array
        user.wishlist.splice(findItemIndex, 1);

        // Save the updated user document
        const updatedUser = await user.save();

        res.json({ message: 'Item removed from wishlist', updatedUser });
    } catch (error) {
        console.error('Error removing product from wishlist:', error);
        res.status(500).json({
            status: 'ERROR',
            message: 'Internal Server Error. Please try again.'
        })
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

export const productController = { createProduct, getProductById, fetchAllProduct, deleteProduct, addToWishlist, removeFromWishlist, updateProduct, starRating, searchProducts };


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