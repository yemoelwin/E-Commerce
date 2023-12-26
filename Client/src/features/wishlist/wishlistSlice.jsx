import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import wishlistService from "./wishlistService";

const initialState = {
	wishlist: localStorage.getItem("wishlistItems")
		? JSON.parse(localStorage.getItem("wishlistItems"))
		: [],
	wishlist_count: [],
	isError: false,
	isLoading: false,
	isSuccess: false,
	errorMessage: "",
	message: "",
};

export const getWishlist = createAsyncThunk(
	"wishlist/get-wishlist",
	async (thunkApi) => {
		try {
			const response = await wishlistService.getUserWishlist();
			return response;
		} catch (error) {
			console.log(error);
			return thunkApi.rejectWithValue(error);
		}
	},
);

export const addToWishlist = createAsyncThunk(
	"wishlist/user-wishlist",
	async (prodId, thunkApi) => {
		try {
			const response = await wishlistService.wishlist(prodId);
			return response;
		} catch (error) {
			console.log(error);
			const errorMessage = error.message || "An error occurred.";
			return thunkApi.rejectWithValue(errorMessage);
		}
	},
);

export const wishlistSlice = createSlice({
	name: "wishlist",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(getWishlist.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(getWishlist.fulfilled, (state, action) => {
				state.isError = false;
				state.isLoading = false;
				state.isSuccess = true;
				state.message = "Success";
				state.errorMessage = null;
				state.wishlist = action.payload;
			})
			.addCase(getWishlist.rejected, (state, action) => {
				state.isError = true;
				state.isLoading = false;
				state.isSuccess = false;
				state.message = "Failed";
				state.errorMessage = action.payload;
				state.users = null;
			})
			/* wishlist */
			.addCase(addToWishlist.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(addToWishlist.fulfilled, (state, action) => {
				state.isError = false;
				state.isLoading = false;
				state.isSuccess = true;
				state.message = "Success";
				state.errorMessage = null;
				state.wishlist = action.payload;
				localStorage.setItem("wishlistItems", JSON.stringify(action.payload));
			})
			.addCase(addToWishlist.rejected, (state, action) => {
				state.isError = true;
				state.isLoading = false;
				state.isSuccess = false;
				state.message = "Failed";
				state.errorMessage = action.payload;
				state.users = null;
			});
	},
});

export default wishlistSlice.reducer;
