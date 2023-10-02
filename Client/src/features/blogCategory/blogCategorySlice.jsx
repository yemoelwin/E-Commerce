import { createSlice, createAsyncThunk, createAction } from '@reduxjs/toolkit';
import blogCategoryService from './blogCategoryService';

const initialState = {
    blogCategories: [],
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: '',
};

export const getAllBlogCategory = createAsyncThunk('blog_category/get-allBlogCategory', async(thunkApi) => {
    try {
        const response = await blogCategoryService.allBlogCategory();
        return response;
    } catch (error) {
        console.log(error);
        const errorMessage = error.message || 'An error occurred.'
        return thunkApi.rejectWithValue(errorMessage);
    }
});

export const createBlogCategory = createAsyncThunk('blog_category/create-blogCategory', async(blogCategoryData, thunkApi) => {
    try {
        const response = await blogCategoryService.createBlogCategory(blogCategoryData);
        return response;
    } catch (error) {
        console.log(error);
        const errorMessage = error.message || 'An error occurred.'
        return thunkApi.rejectWithValue(errorMessage);
    }
});

export const updateBlogCategory = createAsyncThunk(
    'blog_category/update-blogCategory', async (blogCategoryData, thunkApi) => {
    try {
        const response = await blogCategoryService.updateBlogCategory(blogCategoryData);
        return response;
    } catch (error) {
        console.log(error);
        const errorMessage = error.message || 'An error occurred.'
        return thunkApi.rejectWithValue(errorMessage);
    }
});

export const getBlogCategory = createAsyncThunk('blog_category/get-blogCategory', async(id, thunkApi) => {
    try {
        const response = await blogCategoryService.BlogCategory(id);
        return response;
    } catch (error) {
        console.log(error);
        const errorMessage = error.message || 'An error occurred.'
        return thunkApi.rejectWithValue(errorMessage);
    }
});

export const deleteBlogCategory = createAsyncThunk('blog_category/delete-blogCategory', async(id, thunkApi) => {
    try {
        const response = await blogCategoryService.deleteBlogCategory(id);
        return response;
    } catch (error) {
        console.log(error);
        const errorMessage = error.message || 'An error occurred.'
        return thunkApi.rejectWithValue(errorMessage);
    }
});

export const blogCategoryResetState = createAction('Reset_all')

export const blogCategorySlice = createSlice({
    name: 'blogCategory',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllBlogCategory.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getAllBlogCategory.fulfilled, (state, action) => {
                state.blogCategories = action.payload;
                state.isError = false;
                state.isSuccess = true;
                state.isLoading = false;
                state.message = 'Success';
            })
            .addCase(getAllBlogCategory.rejected, (state, action) => {
                state.blogCategories = null;
                state.isError = true;
                state.isSuccess = false;
                state.isLoading = false;
                state.message = action.error.message || "An error occurred.";
            })
            /* Create Blog Category */
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
            /* Get Single Blog Category */
            .addCase(getBlogCategory.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getBlogCategory.fulfilled, (state, action) => {
                state.isError = false;
                state.isSuccess = true;
                state.isLoading = false;
                state.message = 'Success';
                state.blogCatName = action.payload.title;
            })
            .addCase(getBlogCategory.rejected, (state, action) => {
                state.blogCategories = null;
                state.isError = true;
                state.isSuccess = false;
                state.isLoading = false;
                state.message = action.payload || "An error occurred.";
            })
            /* Update Blog Category */
            .addCase(updateBlogCategory.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateBlogCategory.fulfilled, (state, action) => {
                state.isError = false;
                state.isSuccess = true;
                state.isLoading = false;
                state.message = 'Success';
                state.updatedCategory = action.payload;
            })
            .addCase(updateBlogCategory.rejected, (state, action) => {
                state.blogCategories = null;
                state.isError = true;
                state.isSuccess = false;
                state.isLoading = false;
                state.message = action.payload || "An error occurred.";
            })
            /* Delete Blog Category */
            .addCase(deleteBlogCategory.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteBlogCategory.fulfilled, (state, action) => {
                state.isError = false;
                state.isSuccess = true;
                state.isLoading = false;
                state.message = 'Success';
                state.blogCategories = action.payload;
            })
            .addCase(deleteBlogCategory.rejected, (state, action) => {
                state.blogCategories = null;
                state.isError = true;
                state.isSuccess = false;
                state.isLoading = false;
                state.message = action.payload || "An error occurred.";
            })
            .addCase(blogCategoryResetState, () => initialState);
    }
});

export default blogCategorySlice.reducer;