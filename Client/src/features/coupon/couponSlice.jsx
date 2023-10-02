import { createSlice, createAsyncThunk, createAction } from '@reduxjs/toolkit';
import couponService from './couponService';

const initialState = {
    coupons: [],
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: '',
};

export const getCoupons = createAsyncThunk('coupon/get-coupons', async(thunkApi) => {
    try {
        return await couponService.getAllCoupons();
    } catch (error) {
        console.log(error);
        const errorMessage = error.message || "An error occurred.";
        return thunkApi.rejectWithValue(errorMessage);
    }
});

export const createNewCoupon = createAsyncThunk('coupon/create-coupon', async(couponData, thunkApi) => {
    try {
        return await couponService.createCoupon(couponData);
    } catch (error) {
        const errorMessage = error.message || "An error occurred.";
        return thunkApi.rejectWithValue(errorMessage);
    }
});

export const deleteCoupon = createAsyncThunk('coupon/delete-coupon', async(id, thunkApi) => {
    try {
        const response = await couponService.deleteCoupon(id);
        return response;
    } catch (error) {
        const errorMessage = error.message || "An error occurred.";
        return thunkApi.rejectWithValue(errorMessage);
    }
});

export const couponResetState = createAction("reset_all")

export const couponSlice = createSlice({
    name: 'coupon',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getCoupons.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getCoupons.fulfilled, (state, action) => {
                state.coupons = action.payload;
                state.isError = false;
                state.isSuccess = true;
                state.isLoading = false;
                state.message = 'Success';
            })
            .addCase(getCoupons.rejected, (state, action) => {
                state.coupons = null;
                state.isError = true;
                state.isSuccess = false;
                state.isLoading = false;
                state.message = action.payload || "An error occurred.";
            })
            /* Create Coupon */
            .addCase(createNewCoupon.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createNewCoupon.fulfilled, (state, action) => {
                state.createdCoupon = action.payload;
                state.isError = false;
                state.isSuccess = true;
                state.isLoading = false;
                state.message = 'Success';
            })
            .addCase(createNewCoupon.rejected, (state, action) => {
                state.coupons = null;
                state.isError = true;
                state.isSuccess = false;
                state.isLoading = false;
                state.message = action.payload || "An error occurred.";
            })
            /* Delete Coupon */
            .addCase(deleteCoupon.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteCoupon.fulfilled, (state, action) => {
                state.isError = false;
                state.isSuccess = true;
                state.isLoading = false;
                state.message = 'Success';
                state.deletedCoupon = action.payload;
            })
            .addCase(deleteCoupon.rejected, (state, action) => {
                state.coupons = null;
                state.isError = true;
                state.isSuccess = false;
                state.isLoading = false;
                state.message = action.payload || "An error occurred.";
            })
            .addCase(couponResetState, () => initialState);
    }
});

export default couponSlice.reducer;