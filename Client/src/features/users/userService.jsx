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

const saveOrder = async (data) => {
	try {
		const response = await api.post("/user/order/create_userOrder", {
			cartData: data.cartData,
			cartTotalAmount: data.cartTotalAmount,
			totalQuantity: data.totalQuantity,
			transitionId: data.transitionId,
		});
		console.log("reponsedata", response.data);
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

const getOrder = async ({ userId, id }) => {
	try {
		const response = await api.get(`/user/order/get_order/${userId}/${id}`);
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

const getInvoice = async ({ userId, transitionId }) => {
	try {
		const response = await api.get(
			`/user/invoice/user-invoice/${userId}/${transitionId}`,
		);
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

const getOrders = async (id) => {
	try {
		const response = await api.get(`/user/order/user-orders/${id}`);
		return response.data;
	} catch (error) {
		if (error.response && error.response.data && error.response.data.message) {
			// Extract and return the error message from the backend
			throw new Error(error.response.data.message);
		} else {
			console.error("error", error);
			throw new Error("An error occurred while getting single user orders."); // Fallback error message
		}
	}
};

const getallUserOrders = async () => {
	try {
		const response = await api.get(`/user/order/all-orders`);
		return response.data;
	} catch (error) {
		if (error.response && error.response.data && error.response.data.message) {
			// Extract and return the error message from the backend
			throw new Error(error.response.data.message);
		} else {
			console.error("error", error);
			throw new Error("An error occurred while fetching all orders."); // Fallback error message
		}
	}
};

const updateOrderStatus = async (data) => {
	console.log("orderServiceData", data);
	try {
		const response = await api.put(`/user/order/order_status/${data.id}`, {
			delivery_status: data.delivery_status,
		});
		return response.data;
	} catch (error) {
		if (error.response && error.response.data && error.response.data.message) {
			// Extract and return the error message from the backend
			throw new Error(error.response.data.message);
		} else {
			console.error("error", error);
			throw new Error("An error occurred while updating order status."); // Fallback error message
		}
	}
};

const deleteOrder = async (id) => {
	try {
		const response = await api.delete(`/user/delete_order/${id}`);
		return response.data;
	} catch (error) {
		if (error.response && error.response.data && error.response.data.message) {
			// Extract and return the error message from the backend
			throw new Error(error.response.data.message);
		} else {
			console.error("error", error);
			throw new Error("An error occurred while deleting order."); // Fallback error message
		}
	}
};

// const invoicePDF = async (id) => {
// 	try {
// 		const response = await api.get(`/invoice/pdf-invoice/${id}`);
// 		return response.data;
// 	} catch (error) {
// 		if (error.response && error.response.data && error.response.data.message) {
// 			// Extract and return the error message from the backend
// 			throw new Error(error.response.data.message);
// 		} else {
// 			console.error("error", error);
// 			throw new Error("An error occurred while fetching user wishlist."); // Fallback error message
// 		}
// 	}
// };

const userService = {
	getUserWishlist,
	saveOrder,
	getOrder,
	getInvoice,
	getOrders,
	updateOrderStatus,
	getallUserOrders,
	deleteOrder,
};

export default userService;
