import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import productService from "./productService";
import { showToast } from "../../containers/common/ShowToast";

const initialState = {
	products: [],
	searchProducts: [],
	addToWishList: [],
	isError: false,
	isLoading: false,
	isSuccess: false,
	message: "",
};

export const getProducts = createAsyncThunk(
	"product/getProducts",
	async (data, thunkApi) => {
		console.log("data", data);
		try {
			const response = await productService.getProducts(data);
			return response;
		} catch (error) {
			console.log(error);
			const errorMessage = error.message || "An error occurred.";
			return thunkApi.rejectWithValue(errorMessage);
		}
	},
);

export const searchInputProducts = createAsyncThunk(
	"product/search-Products",
	async (searchInput, thunkApi) => {
		try {
			const response = await productService.searchProducts(searchInput);
			return response;
		} catch (error) {
			console.log(error);
			const errorMessage = error.message || "An error occurred.";
			return thunkApi.rejectWithValue(errorMessage);
		}
	},
);

export const createProduct = createAsyncThunk(
	"product/createProduct",
	async (data, thunkApi) => {
		try {
			const response = await productService.createProduct(data);
			return response;
		} catch (error) {
			console.log(error);
			const errorMessage = error.message || "An error occurred.";
			return thunkApi.rejectWithValue(errorMessage);
		}
	},
);

export const addToWishlistProduct = createAsyncThunk(
	"product/wishlist",
	async (prodId, thunkApi) => {
		try {
			const response = await productService.addToWishlist(prodId);
			return response;
		} catch (error) {
			console.log(error);
			const errorMessage = error.message || "An error occurred.";
			return thunkApi.rejectWithValue(errorMessage);
		}
	},
);

export const removeWishlist = createAsyncThunk(
	"product/remove_wishlist",
	async (prodId, thunkApi) => {
		try {
			const response = await productService.removeFromToWishlist(prodId);
			return response;
		} catch (error) {
			console.log(error);
			const errorMessage = error.message || "An error occurred.";
			return thunkApi.rejectWithValue(errorMessage);
		}
	},
);

export const fetchProductData = createAsyncThunk(
	"product/fetch-single-Product",
	async (prodId, thunkApi) => {
		try {
			const response = await productService.getProduct(prodId);
			return response;
		} catch (error) {
			console.log(error);
			const errorMessage = error.message || "An error occurred.";
			return thunkApi.rejectWithValue(errorMessage);
		}
	},
);

export const updateProductData = createAsyncThunk(
	"product/update-Product",
	async (data, thunkApi) => {
		try {
			const response = await productService.updateProduct(data);
			return response;
		} catch (error) {
			console.log(error);
			const errorMessage = error.message || "An error occurred.";
			return thunkApi.rejectWithValue(errorMessage);
		}
	},
);

export const deleteProduct = createAsyncThunk(
	"product/deleteProduct",
	async (id, thunkApi) => {
		try {
			const response = await productService.deleteProduct(id);
			return response;
		} catch (error) {
			console.log(error);
			const errorMessage = error.message || "An error occurred.";
			return thunkApi.rejectWithValue(errorMessage);
		}
	},
);

export const rating = createAsyncThunk(
	"product/rating star-comment",
	async (data, thunkApi) => {
		console.log("rating data of slice", data);
		try {
			const response = await productService.rating(data);
			return response;
		} catch (error) {
			console.log(error);
			const errorMessage = error.message || "An error occurred.";
			return thunkApi.rejectWithValue(errorMessage);
		}
	},
);

export const productResetState = createAction("reset_all");
export const addToWishListReset = createAction("reset_addToWishlists");
export const clearSearchState = createAction("clear-searchData");

export const productSlice = createSlice({
	name: "product",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(getProducts.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(getProducts.fulfilled, (state, action) => {
				state.products = action.payload;
				state.isError = false;
				state.isSuccess = true;
				state.isLoading = false;
				state.message = "Success";
			})
			.addCase(getProducts.rejected, (state, action) => {
				state.products = null;
				state.isError = true;
				state.isSuccess = false;
				state.isLoading = false;
				state.message = action.error.message || "An error occurred.";
			})
			/* Search Products */
			.addCase(searchInputProducts.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(searchInputProducts.fulfilled, (state, action) => {
				state.isError = false;
				state.isLoading = false;
				state.isSuccess = true;
				state.message = "Success";
				state.searchProducts = action.payload;
			})
			.addCase(searchInputProducts.rejected, (state, action) => {
				state.searchProducts = null;
				state.isError = true;
				state.isSuccess = false;
				state.isLoading = false;
				state.message = action.error.message || "An error occurred.";
			})
			/* Create Product */
			.addCase(createProduct.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(createProduct.fulfilled, (state, action) => {
				state.createdProduct = action.payload;
				state.isError = false;
				state.isSuccess = true;
				state.isLoading = false;
				state.message = "Success";
			})
			.addCase(createProduct.rejected, (state, action) => {
				state.products = null;
				state.isError = true;
				state.isSuccess = false;
				state.isLoading = false;
				state.message = action.error.message || "An error occurred.";
			})
			/* Fetch single Product */
			.addCase(fetchProductData.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(fetchProductData.fulfilled, (state, action) => {
				state.isError = false;
				state.isSuccess = true;
				state.isLoading = false;
				state.message = "Success";
				state.singleData = action.payload;
			})
			.addCase(fetchProductData.rejected, (state, action) => {
				state.products = null;
				state.isError = true;
				state.isSuccess = false;
				state.isLoading = false;
				state.message = action.error.message || "An error occurred.";
			})
			/* Update Product */
			.addCase(updateProductData.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(updateProductData.fulfilled, (state, action) => {
				const {
					title,
					description,
					category,
					price,
					color,
					brand,
					tags,
					images,
					quantity,
				} = action.payload;
				state.isError = false;
				state.isSuccess = true;
				state.isLoading = false;
				state.message = "Success";
				state.updatedData = {
					title,
					description,
					category,
					price,
					color,
					brand,
					tags,
					images,
					quantity,
				};
			})
			.addCase(updateProductData.rejected, (state, action) => {
				state.products = null;
				state.isError = true;
				state.isSuccess = false;
				state.isLoading = false;
				state.message = action.error.message || "An error occurred.";
			})
			/* Delete Product */
			.addCase(deleteProduct.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(deleteProduct.fulfilled, (state, action) => {
				state.isError = false;
				state.isSuccess = true;
				state.isLoading = false;
				state.message = "Success";
				state.deletedProduct = action.payload;
			})
			.addCase(deleteProduct.rejected, (state, action) => {
				state.products = null;
				state.isError = true;
				state.isSuccess = false;
				state.isLoading = false;
				state.message = action.error.message || "An error occurred.";
			})
			/* Add to WishList */
			.addCase(addToWishlistProduct.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(addToWishlistProduct.fulfilled, (state, action) => {
				state.isError = false;
				state.isSuccess = true;
				state.isLoading = false;
				state.message = "Success";
				state.addToWishList = action.payload;
				if (
					state.addToWishList.message &&
					state.addToWishList.message.includes("already exists")
				) {
					showToast(state.addToWishList.message, "info");
				} else if (
					state.addToWishList.message &&
					state.addToWishList.message.includes("Product added to wishlist.")
				) {
					showToast(state.addToWishList.message, "success");
				}
			})
			.addCase(addToWishlistProduct.rejected, (state, action) => {
				state.products = null;
				state.isError = true;
				state.isSuccess = false;
				state.isLoading = false;
				state.message = action.error.message || "An error occurred.";
			})
			/* removeFrom wishlist */
			.addCase(removeWishlist.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(removeWishlist.fulfilled, (state, action) => {
				state.wishlistProduct = action.payload;
				state.isError = false;
				state.isSuccess = true;
				state.isLoading = false;
				state.message = "Success";
			})
			.addCase(removeWishlist.rejected, (state, action) => {
				state.products = null;
				state.isError = true;
				state.isSuccess = false;
				state.isLoading = false;
				state.message = action.error.message || "An error occurred.";
			})
			/* rating stars and comment */
			.addCase(rating.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(rating.fulfilled, (state, action) => {
				state.newRating = action.payload;
				state.isError = false;
				state.isSuccess = true;
				state.isLoading = false;
				state.message = "Success";
			})
			.addCase(rating.rejected, (state, action) => {
				state.products = null;
				state.isError = true;
				state.isSuccess = false;
				state.isLoading = false;
				state.message = action.error.message || "An error occurred.";
			})
			/*  */
			.addCase(productResetState, () => initialState)
			.addCase(addToWishListReset, (state) => {
				state.addToWishList = null;
			})
			.addCase(clearSearchState, (state) => {
				state.searchProducts = null;
			});
	},
});

export default productSlice.reducer;
