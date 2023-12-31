import api from "../../app/api/currentApi";

const getUserWishlist = async () => {
	try {
		const response = await api.get("/user/wish/user_wishlist");
		return response.data;
	} catch (error) {
		if (error.response && error.response.data && error.response.data.message) {
			// Extract and return the error message from the backend
			throw new Error(error.response.data.message);
		} else {
			console.error("error", error);
			throw new Error("An error occurred while fetching user wishlist."); // Fallback error message
		}
	}
};

const wishlist = async (prodId) => {
	try {
		const response = await api.put(`/product/user-wishlist`, { prodId });
		return response.data;
	} catch (error) {
		if (error.response && error.response.data && error.response.data.message) {
			throw new Error(error.response.data.message);
		} else {
			console.error("error", error);
			throw new Error("An error occurred on wishlist process."); // Fallback error message
		}
	}
};

const wishlistService = {
	getUserWishlist,
	wishlist,
};

export default wishlistService;
