import Product from "../models/productModel.js";
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import slugify from "slugify";

const createProduct = asyncHandler(async (req, res) => {
	try {
		const {
			title,
			description,
			price,
			brand,
			category,
			quantity,
			color,
			images,
			tags,
		} = req.body;
		if (!title) {
			return res.status(400).json({ message: "Title is missing or invalid." });
		}
		const slug = slugify(title, { lower: true, strict: true });
		const existingProduct = await Product.findOne({ slug });
		if (existingProduct) {
			return res.status(409).json({
				status: "FAILED",
				message: "Product with the same slug already exists.",
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
		console.log("newProduct", newProduct);
		await newProduct.save();
		res.status(200).json({
			message: "Product Created Successfully.",
			product: newProduct,
		});
	} catch (error) {
		res.status(500).json({
			status: "FAILED",
			message: "Error occurred while creating the product",
			error: error.message,
		});
	}
});

const getProductById = async (req, res) => {
	const { id } = req.params;
	console.log("backendProdId", id);
	try {
		const fetchProduct = await Product.findById(id).populate({
			path: "ratings.postedby",
			model: "User",
			select: "firstname lastname",
		});
		if (!fetchProduct) {
			return res.status(404).json({
				status: "FAILED",
				message: "This item does not exist.",
			});
		}
		res.status(200).json(fetchProduct);
	} catch (error) {
		res.status(500).json({
			status: "ERROR",
			message: "Internal Server Error.",
		});
	}
};

const fetchAllProduct = asyncHandler(async (req, res) => {
	try {
		//************* Filtering ************* //

		// Create a copy of the req.query object
		const queryObj = { ...req.query };

		// Define an array of fields to be excluded from queryObj
		const excludeFields = ["page", "sort", "limit", "fields"];

		// Loop through each element in excludeFields and delete it from queryObj
		excludeFields.forEach((element) => delete queryObj[element]);

		// Convert the modified queryObj to a JSON string and Replace specific comparison operators with MongoDB operators in the string
		let queryStr = JSON.stringify(queryObj).replace(
			/\b(gte|gt|lte|lt)\b/g,
			(match) => `$${match}`,
		);

		let productQuery = Product.find(JSON.parse(queryStr));

		//************* Sorting ************* //
		if (req.query.sort) {
			const sortBy = req.query.sort.split(",").join(" ");

			console.log("sortBy", sortBy);
			productQuery = productQuery
				.collation({ locale: "en", caseLevel: false })
				.sort(sortBy);
		} else {
			productQuery = productQuery.sort({ createdAt: -1 });
		}

		/* Currently not necessary */
		//************* limiting the fields ************* //
		if (req.query.fields) {
			const fields = req.query.fields.split(",").join(" ");

			productQuery = productQuery.select(fields);
		} else {
			productQuery = productQuery.select("-__v");
		}

		//************* pagination ************* //
		const page = req.query.page;

		const limitProduct = req.query.limit;

		const skip = (page - 1) * limitProduct;

		productQuery = productQuery.skip(skip).limit(limitProduct);

		if (req.query.page) {
			const productCount = await Product.countDocuments();
			if (skip >= productCount) {
				return res.status(404).json({
					status: "FAILED",
					message: "The requested page is not found.",
				});
			}
		}

		/* Currently not necessary */

		const products = await productQuery;
		res.json(products);
	} catch (error) {
		console.error("Error fetching all products:", error);
		res.status(500).json({
			status: "ERROR",
			message: "Internal Server Error.",
		});
	}
});

const searchProducts = asyncHandler(async (req, res) => {
	try {
		const searchQuery = req.query.query;
		console.log("searchQueryBackend", searchQuery);
		// const priceQuery = !isNaN(searchQuery) ? { price: searchQuery } : null;
		const filteredProducts = await Product.find({
			$or: [
				{ title: { $regex: searchQuery, $options: "i" } },
				{ brand: { $regex: searchQuery, $options: "i" } },
				{ category: { $regex: searchQuery, $options: "i" } },
				// priceQuery,
			].filter(Boolean),
		});

		res.status(200).json(filteredProducts);
	} catch (error) {
		console.error("Error searching products:", error);
		res.status(500).json({
			status: "ERROR",
			message: "Internal Server Error.",
		});
	}
});

const updateProduct = asyncHandler(async (req, res) => {
	const { id } = req.params;
	const {
		title,
		description,
		price,
		brand,
		category,
		quantity,
		color,
		images,
		tags,
	} = req.body;
	try {
		// console.log('Request body:', req.body);
		if (typeof title !== "string" || !title.trim()) {
			return res.status(400).json({ message: "Invalid or missing title." });
		}
		const slug = slugify(title, { lower: true, strict: true });
		req.body.slug = slug;
		const product = await Product.findByIdAndUpdate(
			id,
			{
				title,
				description,
				price,
				brand,
				category,
				quantity,
				color,
				images,
				tags,
				slug,
			},
			{ new: true },
		);
		if (!product) {
			return res.status(404).json({
				status: "FAILED",
				message: "No product found.",
			});
		}
		res.status(200).json({
			product: product,
			status: "SUCCESS",
			message: "Product successfully updated.",
		});
	} catch (error) {
		console.error("Error updating product:", error);
		res.status(500).json({
			status: "ERROR",
			message: "Internal Server Error. Please try again.",
		});
	}
});

const deleteProduct = asyncHandler(async (req, res) => {
	const { id } = req.params;
	try {
		const product = await Product.findOneAndDelete({ _id: id });
		if (!product) {
			res.status(404).json({
				status: "FAILED",
				message: "No product found.",
			});
		}
		res.status(200).json({
			status: "SUCCESS",
			message: "Successfully deleted.",
			product: product,
		});
	} catch (error) {
		res.status(500).json({
			status: "ERROR OCCURRED",
			message: "Something went wrong. Please try again.",
		});
	}
});

const wishlist = asyncHandler(async (req, res) => {
	const { _id } = req.user;
	const { prodId } = req.body;
	try {
		const user = await User.findById(_id);
		const alreadyAdded = user.wishlist.find((id) => id.toString() === prodId);
		if (alreadyAdded) {
			let user = await User.findByIdAndUpdate(
				_id,
				{
					$pull: {
						wishlist: prodId,
					},
				},
				{ new: true },
			);
			res.status(200).json({ message: "Item removed from wishlist.", user });
		} else {
			let user = await User.findByIdAndUpdate(
				_id,
				{
					$push: {
						wishlist: prodId,
					},
				},
				{ new: true },
			);
			res.status(200).json({ message: "Product added to wishlist.", user });
		}
	} catch (error) {
		res.status(500).json({
			message: "Internal Server Error",
		});
	}
});

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

		await User.findByIdAndUpdate(_id);
		if (alreadyAdded) {
			res.json({ message: "Product already exists in the wishlist." });
		} else {
			const updatedItemWishlist = await User.findByIdAndUpdate(
				_id,
				{ $push: { wishlist: prodId } },
				{ new: true },
			);
			res.json({ message: "Product added to wishlist.", updatedItemWishlist });
		}
	} catch (error) {
		res.status(500).json({
			message: "Error Occurred while adding the product to the user's wishlist",
		});
	}
});

const removeFromWishlist = asyncHandler(async (req, res) => {
	const { _id } = req.user;
	const { prodId } = req.body;
	try {
		const user = await User.findById(_id);
		if (!user)
			return res.status(404).json({ message: "User does not exists." });
		const findItemIndex = user.wishlist.indexOf(prodId);
		if (findItemIndex === -1)
			return res
				.status(404)
				.json({ message: "Item not found in the wishlist." });

		// Remove the product from the wishlist array
		user.wishlist.splice(findItemIndex, 1);

		// Save the updated user document
		const updatedUser = await user.save();

		res.json({ message: "Item removed from wishlist", updatedUser });
	} catch (error) {
		console.error("Error removing product from wishlist:", error);
		res.status(500).json({
			status: "ERROR",
			message: "Internal Server Error. Please try again.",
		});
	}
});

const starRating = asyncHandler(async (req, res) => {
	const { _id } = req.user;
	// console.log("_id", _id);
	const { stars, prodId, comment } = req.body;
	// console.log("star n prodId n comment", stars, prodId, comment);
	try {
		const product = await Product.findById(prodId);
		if (!product)
			return res.status(404).json({ message: "product not found!" });
		let alreadyRated = product.ratings.find(
			(userId) => userId.postedby.toString() === _id.toString(),
		);
		if (alreadyRated) {
			await Product.updateOne(
				{
					ratings: { $elemMatch: alreadyRated },
				},
				{
					$set: { "ratings.$.stars": stars, "ratings.$.comment": comment },
				},
				{ new: true },
			).populate("ratings.postedby", "firstname lastname");
		} else {
			await Product.findByIdAndUpdate(
				prodId,
				{
					$push: {
						ratings: {
							stars: stars,
							comment: comment,
							postedby: _id,
						},
					},
				},
				{ new: true },
			).populate("ratings.postedby", "firstname lastname");
		}

		const updatedProduct = await Product.findById(prodId).populate({
			path: "ratings.postedby",
			model: "User", // Assuming your User model is named "User"
			select: "firstname lastname", // Fields to select from the User model
		});

		// const getAllRatings = await Product.findById(prodId);

		let totalRating = updatedProduct.ratings.length;

		console.log("totalRating", totalRating);

		let sumRating = updatedProduct.ratings
			.map((product) => product.stars)
			.reduce((prev, current) => prev + current, 0);
		console.log("sumRating", sumRating);

		let actualRating = Math.round(sumRating / totalRating);
		// let actualRating = Math.round(9 / 2);
		console.log("actualRating", actualRating);

		updatedProduct.totalrating = actualRating;
		await updatedProduct.save();

		res.json(updatedProduct);
	} catch (error) {
		console.error("Error Occurred while rating stars:", error);
		res.status(500).json({
			status: "ERROR",
			message: "Internal Server Error. Please try again.",
		});
	}
});

export const productController = {
	createProduct,
	getProductById,
	fetchAllProduct,
	deleteProduct,
	wishlist,
	addToWishlist,
	removeFromWishlist,
	updateProduct,
	starRating,
	searchProducts,
};

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
