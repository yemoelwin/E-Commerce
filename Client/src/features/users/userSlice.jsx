import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import userService from "./userService";

const initialState = {
    users: [],
    isError: false,
    isLoading: false,
    isSuccess: false,
    errorMessage: '',
    message: "",
}

export const getWishlist = createAsyncThunk('user/get-wishlist', async (thunkApi) => {
    try {
        const response = await userService.getUserWishlist();
        return response;
    } catch (error) {
        console.log(error);
        return thunkApi.rejectWithValue(error);
    }
})

export const addItemToCart = createAsyncThunk('user/to-Cart', async (data,thunkApi) => {
    try {
        const response = await userService.addToCart(data);
        return response;
    } catch (error) {
        console.log(error);
        return thunkApi.rejectWithValue(error);
    }
})

export const userSlice = createSlice({
    name: 'user',
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
                state.message = 'Success';
                state.errorMessage = null;
                state.wishlist = action.payload
            })
            .addCase(getWishlist.rejected, (state, action) => {
                state.isError = true;
                state.isLoading = false;
                state.isSuccess = false;
                state.message = 'Failed';
                state.errorMessage = action.payload;
                state.users = null;
            })
        /* Add to Cart */
            .addCase(addItemToCart.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(addItemToCart.fulfilled, (state, action) => {
                state.isError = false;
                state.isLoading = false;
                state.isSuccess = true;
                state.message = 'Success';
                state.errorMessage = null;
                state.cartItem = action.payload;
            })
            .addCase(addItemToCart.rejected, (state, action) => {
                state.isError = true;
                state.isLoading = false;
                state.isSuccess = false;
                state.message = 'Failed';
                state.errorMessage = action.payload;
                state.users = null;
            })
    }
});

export default userSlice.reducer;