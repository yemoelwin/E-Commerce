import api from "../../app/api/currentApi";

const getProducts = async (data) => {
	try {
		const response = await api.get(
			`/product/?` +
				`${data?.brand ? `brand=${data.brand}&` : ""}` +
				`${data?.category ? `category=${data.category}&` : ""}` +
				`${data?.tag ? `tags=${data.tag}&` : ""}` +
				`${data?.minPrice ? `price[gte]=${data.minPrice}&` : ""}` +
				`${data?.maxPrice ? `price[lte]=${data.maxPrice}&` : ""}` +
				`${data?.sort ? `sort=${data.sort}&` : ""}`,
		);
		return response.data;
	} catch (error) {
		if (error.response && error.response.data && error.response.data.message) {
			throw new Error(error.response.data.message);
		} else {
			console.error("error", error);
			throw new Error("An error occurred while fetching all Products."); // Fallback error message
		}
	}
};

const searchProducts = async (searchInput) => {
	try {
		const response = await api.get(`/product/search/?query=${searchInput}`);
		return response.data;
	} catch (error) {
		if (error.response && error.response.data && error.response.data.message) {
			throw new Error(error.response.data.message);
		} else {
			console.error("error", error);
			throw new Error("An error occurred while searching products."); // Fallback error message
		}
	}
};

const createProduct = async (prod) => {
	try {
		const response = await api.post("/product/create-product", prod);
		return response.data;
	} catch (error) {
		if (error.response && error.response.data && error.response.data.message) {
			throw new Error(error.response.data.message);
		} else {
			console.error("error", error);
			throw new Error("An error occurred while creating new product."); // Fallback error message
		}
	}
};

const addToWishlist = async (prodId) => {
	try {
		const response = await api.put(`/product/wishlist`, { prodId });
		return response.data;
	} catch (error) {
		if (error.response && error.response.data && error.response.data.message) {
			throw new Error(error.response.data.message);
		} else {
			console.error("error", error);
			throw new Error("An error occurred while adding item to wishlist."); // Fallback error message
		}
	}
};

const removeFromToWishlist = async (prodId) => {
	try {
		const response = await api.put(`/product/remove_wishlist`, { prodId });
		return response.data;
	} catch (error) {
		if (error.response && error.response.data && error.response.data.message) {
			throw new Error(error.response.data.message);
		} else {
			console.error("error", error);
			throw new Error(
				"An error occurred while removing product from wishlist.",
			); // Fallback error message
		}
	}
};

const getProduct = async (prodId) => {
	try {
		const response = await api.get(`/product/retrieve/${prodId}`);
		return response.data;
	} catch (error) {
		if (error.response && error.response.data && error.response.data.message) {
			throw new Error(error.response.data.message);
		} else {
			console.error("error", error);
			throw new Error("An error occurred while fetching single product."); // Fallback error message
		}
	}
};

const updateProduct = async (data) => {
	try {
		const response = await api.put(`/product/update/${data.id}`, {
			title: data.prodData.title,
			description: data.prodData.description,
			category: data.prodData.category,
			brand: data.prodData.brand,
			color: data.prodData.color,
			images: data.prodData.images,
			tags: data.prodData.tags,
			price: data.prodData.price,
			quantity: data.prodData.quantity,
		});
		return response.data;
	} catch (error) {
		if (error.response && error.response.data && error.response.data.message) {
			throw new Error(error.response.data.message);
		} else {
			console.error("error", error);
			throw new Error("An error occurred while updating product."); // Fallback error message
		}
	}
};

const deleteProduct = async (id) => {
	try {
		const response = await api.delete(`/product/delete/${id}`);
		return response.data;
	} catch (error) {
		if (error.response && error.response.data && error.response.data.message) {
			throw new Error(error.response.data.message);
		} else {
			console.error("error", error);
			throw new Error("An error occurred while deleting product."); // Fallback error message
		}
	}
};

const rating = async (data) => {
	try {
		const response = await api.put(`/product/star-rating/comment`, {
			stars: data.stars,
			prodId: data.prodId,
			comment: data.comment,
		});
		return response.data;
	} catch (error) {
		if (error.response && error.response.data && error.response.data.message) {
			throw new Error(error.response.data.message);
		} else {
			console.error("error", error);
			throw new Error("An error occurred while rating stars and comments."); // Fallback error message
		}
	}
};

const productService = {
	getProducts,
	searchProducts,
	createProduct,
	addToWishlist,
	removeFromToWishlist,
	getProduct,
	updateProduct,
	deleteProduct,
	rating,
};

export default productService;
