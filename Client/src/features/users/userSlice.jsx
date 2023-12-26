import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import userService from "./userService";

const initialState = {
	users: [] /* not necessary */,
	orders: [],
	isError: false,
	isLoading: false,
	isSuccess: false,
	errorMessage: "",
	message: "",
};

export const createOrder = createAsyncThunk(
	"user/create-order",
	async (data, thunkApi) => {
		try {
			const response = await userService.saveOrder(data);
			console.log("create Order", response.data);
			return response;
		} catch (error) {
			console.log(error);
			return thunkApi.rejectWithValue(error);
		}
	},
);

export const getOrder = createAsyncThunk(
	"user/get-order",
	async ({ userId, id }, thunkApi) => {
		try {
			const response = await userService.getOrder({ userId, id });
			return response;
		} catch (error) {
			console.log(error);
			return thunkApi.rejectWithValue(error);
		}
	},
);

export const getInvoiceData = createAsyncThunk(
	"user/get-Invoice",
	async ({ userId, transitionId }, thunkApi) => {
		try {
			const response = await userService.getInvoice({ userId, transitionId });
			return response;
		} catch (error) {
			console.log(error);
			return thunkApi.rejectWithValue(error);
		}
	},
);

export const fetchOrders = createAsyncThunk(
	"auth/get-user-orders",
	async (id, thunkApi) => {
		try {
			const response = await userService.getOrders(id);
			return response;
		} catch (error) {
			const errorMessage = error.message || "An error occurred.";
			return thunkApi.rejectWithValue(errorMessage);
		}
	},
);

export const allUserOrders = createAsyncThunk(
	"auth/get-all-orders",
	async (thunkApi) => {
		try {
			const response = await userService.getallUserOrders();
			return response;
		} catch (error) {
			const errorMessage = error.message || "An error occurred.";
			return thunkApi.rejectWithValue(errorMessage);
		}
	},
);

export const updateOrderStatus = createAsyncThunk(
	"auth/update-order-status",
	async (data, thunkApi) => {
		try {
			const response = await userService.updateOrderStatus(data);
			return response;
		} catch (error) {
			const errorMessage = error.message || "An error occurred.";
			return thunkApi.rejectWithValue(errorMessage);
		}
	},
);

export const deleteOrder = createAsyncThunk(
	"auth/delete-order",
	async (id, thunkApi) => {
		try {
			const response = await userService.deleteOrder(id);
			return response;
		} catch (error) {
			const errorMessage = error.message || "An error occurred.";
			return thunkApi.rejectWithValue(errorMessage);
		}
	},
);

export const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			/* Save to Cart */
			.addCase(createOrder.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(createOrder.fulfilled, (state, action) => {
				state.isError = false;
				state.isLoading = false;
				state.isSuccess = true;
				state.message = "Success";
				state.errorMessage = null;
				state.userCart = action.payload;
			})
			.addCase(createOrder.rejected, (state, action) => {
				state.isError = true;
				state.isLoading = false;
				state.isSuccess = false;
				state.message = "Failed";
				state.errorMessage = action.payload;
				state.users = null;
			})
			/* Get Order */
			.addCase(getOrder.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(getOrder.fulfilled, (state, action) => {
				state.isError = false;
				state.isLoading = false;
				state.isSuccess = true;
				state.message = "Success";
				state.errorMessage = null;
				state.orderDetail = action.payload;
			})
			.addCase(getOrder.rejected, (state, action) => {
				state.isError = true;
				state.isLoading = false;
				state.isSuccess = false;
				state.message = "Failed";
				state.errorMessage = action.payload;
				state.users = null;
			})
			/* GET Invoice */
			.addCase(getInvoiceData.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(getInvoiceData.fulfilled, (state, action) => {
				state.isError = false;
				state.isLoading = false;
				state.isSuccess = true;
				state.message = "Success";
				state.errorMessage = null;
				state.orderDetail = action.payload;
			})
			.addCase(getInvoiceData.rejected, (state, action) => {
				state.isError = true;
				state.isLoading = false;
				state.isSuccess = false;
				state.message = "Failed";
				state.errorMessage = action.payload;
				state.users = null;
			})
			/* Fetch Single User Orders */
			.addCase(fetchOrders.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(fetchOrders.fulfilled, (state, action) => {
				state.isAuthenticated = true;
				state.isError = false;
				state.isLoading = false;
				state.isSuccess = true;
				state.isLoggedIn = true;
				state.orders = action.payload;
				state.message = "Success";
			})
			.addCase(fetchOrders.rejected, (state, action) => {
				state.isLoading = false;
				state.isAuthenticated = false;
				state.isError = true;
				state.isSuccess = false;
				state.orders = null;
				state.isLoggedIn = false;
				state.message = action.error.message || "An error occurred.";
			})
			/* Get All User Orders */
			.addCase(allUserOrders.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(allUserOrders.fulfilled, (state, action) => {
				state.isAuthenticated = true;
				state.isError = false;
				state.isLoading = false;
				state.isSuccess = true;
				state.isLoggedIn = true;
				state.userOrders = action.payload;
				state.message = "Success";
			})
			.addCase(allUserOrders.rejected, (state, action) => {
				state.isLoading = false;
				state.isAuthenticated = false;
				state.isError = true;
				state.isSuccess = false;
				state.orders = null;
				state.isLoggedIn = false;
				state.message = action.error.message || "An error occurred.";
			})
			/* Update Order Status */
			.addCase(updateOrderStatus.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(updateOrderStatus.fulfilled, (state, action) => {
				state.isAuthenticated = true;
				state.isError = false;
				state.isLoading = false;
				state.isSuccess = true;
				state.message = "Success";
				state.orderStatus = action.payload;
			})
			.addCase(updateOrderStatus.rejected, (state, action) => {
				state.isLoading = false;
				state.isAuthenticated = false;
				state.isError = true;
				state.isSuccess = false;
				state.isLoggedIn = false;
				state.orders = null;
				state.message = action.error.message || "An error occurred.";
			})
			// /* Delete Order */
			.addCase(deleteOrder.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(deleteOrder.fulfilled, (state, action) => {
				state.isAuthenticated = true;
				state.isError = false;
				state.isLoading = false;
				state.isSuccess = true;
				state.message = "Success";
				state.deletedOrder = action.payload;
			})
			.addCase(deleteOrder.rejected, (state, action) => {
				state.isLoading = false;
				state.isAuthenticated = false;
				state.isError = true;
				state.isSuccess = false;
				state.orders = null;
				state.isLoggedIn = false;
				state.message = action.error.message || "An error occurred.";
			});
	},
});

export default userSlice.reducer;
