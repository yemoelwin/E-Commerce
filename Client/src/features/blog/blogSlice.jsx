import { createSlice, createAsyncThunk, createAction } from '@reduxjs/toolkit';
import blogService from './blogService';

const initialState = {
    blogs: [],
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: '',
};

export const getAllBlog = createAsyncThunk('blog/get-allblog', async(thunkApi) => {
    try {
        const response = await blogService.getBlogs();
        return response;
    } catch (error) {
        console.log(error);
        return thunkApi.rejectWithValue(error);
    }
});

export const createNewBlog = createAsyncThunk('blog/create-blog', async(blogData, thunkApi) => {
    try {
        const response = await blogService.createNewBlog(blogData);
        return response;
    } catch (error) {
        const errorMessage = error.message || "An error occurred.";
        return thunkApi.rejectWithValue(errorMessage);
    }
});

export const getBlog = createAsyncThunk('blog/get-singleblog', async(id, thunkApi) => {
    try {
        const response = await blogService.getBlog(id);
        return response;
    } catch (error) {
        const errorMessage = error.message || "An error occurred.";
        return thunkApi.rejectWithValue(errorMessage);
    }
});

export const updateABlog = createAsyncThunk('blog/update-singleblog', async(newData, thunkApi) => {
    try {
        const response = await blogService.updateBlogData(newData);
        return response;
    } catch (error) {
        const errorMessage = error.message || "An error occurred.";
        return thunkApi.rejectWithValue(errorMessage);
    }
});

export const deleteBlog = createAsyncThunk('blog/delete-blog', async(id, thunkApi) => {
    try {
        const response = await blogService.deleteBlog(id);
        return response;
    } catch (error) {
        const errorMessage = error.message || "An error occurred.";
        return thunkApi.rejectWithValue(errorMessage);
    }
});

export const blogResetState = createAction("reset_all")

export const blogSlice = createSlice({
    name: 'blog',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllBlog.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getAllBlog.fulfilled, (state, action) => {
                state.blogs = action.payload;
                state.isError = false;
                state.isSuccess = true;
                state.isLoading = false;
                state.message = 'Success';
            })
            .addCase(getAllBlog.rejected, (state, action) => {
                state.blogs = null;
                state.isError = true;
                state.isSuccess = false;
                state.isLoading = false;
                state.message = action.error.message || "An error occurred.";
            })
            /* Create Blog */
            .addCase(createNewBlog.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createNewBlog.fulfilled, (state, action) => {
                state.isError = false;
                state.isSuccess = true;
                state.isLoading = false;
                state.message = 'Success';
                state.newBlogData = action.payload;
            })
            .addCase(createNewBlog.rejected, (state, action) => {
                state.blogs = null;
                state.isError = true;
                state.isSuccess = false;
                state.isLoading = false;
                state.message = action.payload || "An error occurred.";
            })
            /* Get Single Blog */
            .addCase(getBlog.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getBlog.fulfilled, (state, action) => {
                const { title, description, category, images } = action.payload;
                state.isError = false;
                state.isSuccess = true;
                state.isLoading = false;
                state.message = 'Success';
                state.singleBlogData = {
                    title,
                    description,
                    category,
                    images,
                };
            })
            .addCase(getBlog.rejected, (state, action) => {
                state.blogs = null;
                state.isError = true;
                state.isSuccess = false;
                state.isLoading = false;
                state.message = action.payload || "An error occurred.";
            })
            /* Update Blog */
            .addCase(updateABlog.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateABlog.fulfilled, (state, action) => {
                state.isError = false;
                state.isSuccess = true;
                state.isLoading = false;
                state.message = 'Success';
                state.updatedBlogData = action.payload;
            })
            .addCase(updateABlog.rejected, (state, action) => {
                state.blogs = null;
                state.isError = true;
                state.isSuccess = false;
                state.isLoading = false;
                state.message = action.payload || "An error occurred.";
            })
            /* Delete Blog */
            .addCase(deleteBlog.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteBlog.fulfilled, (state, action) => {
                state.isError = false;
                state.isSuccess = true;
                state.isLoading = false;
                state.message = 'Success';
                state.blogs = action.payload;
            })
            .addCase(deleteBlog.rejected, (state, action) => {
                state.blogs = null;
                state.isError = true;
                state.isSuccess = false;
                state.isLoading = false;
                state.message = action.payload || "An error occurred.";
            })
            .addCase(blogResetState, () => initialState);
    }
});

export default blogSlice.reducer;