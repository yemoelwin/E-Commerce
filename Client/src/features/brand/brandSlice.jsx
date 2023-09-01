import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import brandService from './brandService';

const initialState = {
    brands: [],
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: '',
};

export const getBrands = createAsyncThunk('brand/get-brands', async(thunkApi) => {
    try {
        return await brandService.getAllBrands();
    } catch (error) {
        console.log(error);
        return thunkApi.rejectWithValue(error);
    }
});

export const brandSlice = createSlice({
    name: 'brand',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getBrands.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getBrands.fulfilled, (state, action) => {
                state.brands = action.payload;
                state.isError = false;
                state.isSuccess = true;
                state.isLoading = false;
                state.message = 'Success';
            })
            .addCase(getBrands.rejected, (state, action) => {
                state.brands = null;
                state.isError = true;
                state.isSuccess = false;
                state.isLoading = false;
                state.message = action.error.message || "An error occurred.";
        })
    }
});

export default brandSlice.reducer;