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

export const createOrder = createAsyncThunk('user/create-order', async (data, thunkApi) => {
    // console.log('slice Data', data)
    try {
        const response = await userService.saveOrder(data);
        return response;
    } catch (error) {
        console.log(error);
        return thunkApi.rejectWithValue(error);
    }
});

export const getOrder = createAsyncThunk('user/get-order', async ({userId, transitionId}, thunkApi) => {
    console.log('order Data', userId, transitionId)
    try {
        const response = await userService.getOrder({userId, transitionId});
        return response;
    } catch (error) {
        console.log(error);
        return thunkApi.rejectWithValue(error);
    }
});

export const pdfInvoice = createAsyncThunk('invoie/pdf-invoice', async (id, thunkApi) => {
    console.log('order id', id)
    try {
        const response = await userService.invoicePDF(id);
        return response;
    } catch (error) {
        console.log(error);
        return thunkApi.rejectWithValue(error);
    }
});

// export const updateCartItemQuantity = createAsyncThunk('user/update-Cart-Quantity', async (cartData, thunkApi) => {
//     console.log('cartData', cartData);
//     try {
//         const response = await userService.updateQuantity(cartData);
//         return response;
//     } catch (error) {
//         console.log(error);
//         return thunkApi.rejectWithValue(error);
//     }
// })


export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        
    },
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
        /* Save to Cart */
            .addCase(createOrder.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.isError = false;
                state.isLoading = false;
                state.isSuccess = true;
                state.message = 'Success';
                state.errorMessage = null;
                state.userCart = action.payload;
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.isError = true;
                state.isLoading = false;
                state.isSuccess = false;
                state.message = 'Failed';
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
                state.message = 'Success';
                state.errorMessage = null;
                state.orderDetail = action.payload;
            })
            .addCase(getOrder.rejected, (state, action) => {
                state.isError = true;
                state.isLoading = false;
                state.isSuccess = false;
                state.message = 'Failed';
                state.errorMessage = action.payload;
                state.users = null;
            })
        /* Invoice */
            .addCase(pdfInvoice.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(pdfInvoice.fulfilled, (state, action) => {
                state.isError = false;
                state.isLoading = false;
                state.isSuccess = true;
                state.message = 'Success';
                state.errorMessage = null;
                state.invoiceData = action.payload;
            })
            .addCase(pdfInvoice.rejected, (state, action) => {
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