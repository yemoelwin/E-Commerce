import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import categoryService from './categoryService';

const initialState = {
    categories: [],
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: '',
};

export const getCategory = createAsyncThunk('category/get-categorys', async(thunkApi) => {
    try {
        return await categoryService.getAllCategory();
    } catch (error) {
        console.log(error);
        return thunkApi.rejectWithValue(error);
    }
});

export const categorySlice = createSlice({
    name: 'category',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getCategory.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getCategory.fulfilled, (state, action) => {
                state.categories = action.payload;
                state.isError = false;
                state.isSuccess = true;
                state.isLoading = false;
                state.message = 'Success';
            })
            .addCase(getCategory.rejected, (state, action) => {
                state.categories = null;
                state.isError = true;
                state.isSuccess = false;
                state.isLoading = false;
                state.message = action.error.message || "An error occurred.";
        })
    }
});

export default categorySlice.reducer;