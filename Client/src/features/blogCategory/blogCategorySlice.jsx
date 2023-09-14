import { createSlice, createAsyncThunk, createAction } from '@reduxjs/toolkit';
import blogCategoryService from './blogCategoryService';

const initialState = {
    blogCategories: [],
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: '',
};

export const getBlogCategory = createAsyncThunk('blog_category/get-blogCategory', async(thunkApi) => {
    try {
        return await blogCategoryService.getBlogCategory();
    } catch (error) {
        console.log(error);
        return thunkApi.rejectWithValue(error);
    }
});

export const createBlogCategory = createAsyncThunk('blog_category/create-blogCategory', async(blogCategoryData, thunkApi) => {
    try {
        return await blogCategoryService.createBlogCategory(blogCategoryData);
    } catch (error) {
        console.log(error);
        return thunkApi.rejectWithValue(error);
    }
});

export const resetState = createAction('Reset_all')

export const blogCategorySlice = createSlice({
    name: 'blogCategory',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getBlogCategory.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getBlogCategory.fulfilled, (state, action) => {
                state.blogCategories = action.payload;
                state.isError = false;
                state.isSuccess = true;
                state.isLoading = false;
                state.message = 'Success';
            })
            .addCase(getBlogCategory.rejected, (state, action) => {
                state.blogCategories = null;
                state.isError = true;
                state.isSuccess = false;
                state.isLoading = false;
                state.message = action.error.message || "An error occurred.";
            })
            .addCase(createBlogCategory.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createBlogCategory.fulfilled, (state, action) => {
                state.createdBlogCategory = action.payload;
                state.isError = false;
                state.isSuccess = true;
                state.isLoading = false;
                state.message = 'Success';
            })
            .addCase(createBlogCategory.rejected, (state, action) => {
                state.blogCategories = null;
                state.isError = true;
                state.isSuccess = false;
                state.isLoading = false;
                state.message = action.payload || "An error occurred.";
            })
            .addCase(resetState, () => initialState);
    }
});

export default blogCategorySlice.reducer;