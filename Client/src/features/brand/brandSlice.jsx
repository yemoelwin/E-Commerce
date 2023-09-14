import { createSlice, createAsyncThunk, createAction } from '@reduxjs/toolkit';
import brandService from './brandService';
import thunk from 'redux-thunk';

const initialState = {
    brands: [],
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: '',
};

export const getBrands = createAsyncThunk('brand/get-brands', async(thunkApi) => {
    try {
        const response = await brandService.getAllBrands();
        return response;
    } catch (error) {
        console.log(error);
        return thunkApi.rejectWithValue(error);
    }
});

export const getSingleBrand = createAsyncThunk('brand/get-single-brand', async(_id, thunkApi) => {
    try {
        const response = await brandService.getBrand(_id);
        return response;
    } catch (error) {
        console.log(error);
        const errorMessage = error.message || "An error occurred.";
        return thunkApi.rejectWithValue(errorMessage);
    }
});

export const addBrand = createAsyncThunk('brand/add-brand', async(brandData, thunkApi) => {
    try {
        const response = await brandService.addBrand(brandData);
        return response;
    } catch (error) {
        console.log(error);
        return thunkApi.rejectWithValue(error);
    }
});

export const updateBrand = createAsyncThunk('brand/update-brand', async (data, thunkApi) => {
    try {
        const response = await brandService.updateBrand(data);
        return response;
    } catch (error) {
        console.log(error);
        return thunkApi.rejectWithValue(error);
    }
});

export const deleteBrand = createAsyncThunk('brand/delete-brand', async (id, thunkApi) => {
    try {
        const response = await brandService.deleteBrand(id);
        return response;
    } catch (error) {
        console.log(error);
        const errorMessage = error.message || "An error occurred.";
        return thunkApi.rejectWithValue(errorMessage);
    }
})

export const brandResetState = createAction("reset_all");

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
            /* create Brand */
            .addCase(addBrand.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(addBrand.fulfilled, (state, action) => {
                state.isError = false;
                state.isSuccess = true;
                state.isLoading = false;
                state.message = 'Success';
                state.createdBrand = action.payload;
            })
            .addCase(addBrand.rejected, (state, action) => {
                state.brands = null;
                state.isError = true;
                state.isSuccess = false;
                state.isLoading = false;
                state.message = action.payload || "An error occurred.";
            })
            /* get single brand */
            .addCase(getSingleBrand.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getSingleBrand.fulfilled, (state, action) => {
                state.brandName = action.payload.title;
                state.isError = false;
                state.isSuccess = true;
                state.isLoading = false;
                state.message = 'Success';
            })
            .addCase(getSingleBrand.rejected, (state, action) => {
                state.brands = null;
                state.isError = true;
                state.isSuccess = false;
                state.isLoading = false;
                state.message = action.error.message || "An error occurred.";
            })
            /* update Brand  */
            .addCase(updateBrand.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateBrand.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.isSuccess = true;
                state.message = 'Success';
                state.updatedBrand = action.payload;
            })
            .addCase(updateBrand.rejected, (state, action) => {
                state.brands = null;
                state.isError = true;
                state.isSuccess = false;
                state.isLoading = false;
                state.message = action.payload || "An error occurred.";
            })
            /* delete brand */
            .addCase(deleteBrand.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteBrand.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.isSuccess = true;
                state.message = 'Success';
                state.deletedBrand = action.payload;
            })
            .addCase(deleteBrand.rejected, (state, action) => {
                state.brands = null;
                state.isError = true;
                state.isSuccess = false;
                state.isLoading = false;
                state.message = action.payload || "An error occurred.";
            })
            .addCase(brandResetState, () => initialState);
    }
});

export default brandSlice.reducer;