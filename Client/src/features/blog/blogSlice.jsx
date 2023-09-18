import { createSlice, createAsyncThunk, createAction } from '@reduxjs/toolkit';
import blogService from './blogService';

const initialState = {
    blogs: [],
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: '',
};

export const getBlog = createAsyncThunk('blog/get-blog', async(thunkApi) => {
    try {
        return await blogService.getBlogs();
    } catch (error) {
        console.log(error);
        return thunkApi.rejectWithValue(error);
    }
});

export const createNewBlog = createAsyncThunk('blog/create-blog', async(blogData, thunkApi) => {
    try {
        console.log(blogData);
        return await blogService.createNewBlog(blogData);
    } catch (error) {
        const errorMessage = error.message || "An error occurred.";
        return thunkApi.rejectWithValue(errorMessage);
    }
});

export const resetState = createAction("reset_all")

export const blogSlice = createSlice({
    name: 'blog',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getBlog.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getBlog.fulfilled, (state, action) => {
                state.blogs = action.payload;
                state.isError = false;
                state.isSuccess = true;
                state.isLoading = false;
                state.message = 'Success';
            })
            .addCase(getBlog.rejected, (state, action) => {
                state.blogs = null;
                state.isError = true;
                state.isSuccess = false;
                state.isLoading = false;
                state.message = action.error.message || "An error occurred.";
            })
            .addCase(createNewBlog.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createNewBlog.fulfilled, (state, action) => {
                state.createdBlog = action.payload;
                state.isError = false;
                state.isSuccess = true;
                state.isLoading = false;
                state.message = 'Success';
            })
            .addCase(createNewBlog.rejected, (state, action) => {
                state.blogs = null;
                state.isError = true;
                state.isSuccess = false;
                state.isLoading = false;
                state.message = action.payload || "An error occurred.";
            })
            .addCase(resetState, () => initialState);
    }
});

export default blogSlice.reducer;