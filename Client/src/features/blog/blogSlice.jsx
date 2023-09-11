import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
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

export const createBlog = createAsyncThunk('blog/create-blog', async(newData,thunkApi) => {
    try {
        return await blogService.createBlog(newData);
    } catch (error) {
        console.log(error);
        return thunkApi.rejectWithValue(error);
    }
});


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
            .addCase(createBlog.pending, (state) => {
                    state.isLoading = true;
                })
                .addCase(createBlog.fulfilled, (state, action) => {
                    state.blogs = action.payload;
                    state.isError = false;
                    state.isSuccess = true;
                    state.isLoading = false;
                    state.message = 'Success';
                })
                .addCase(createBlog.rejected, (state, action) => {
                    state.blogs = null;
                    state.isError = true;
                    state.isSuccess = false;
                    state.isLoading = false;
                    state.message = action.error.message || "An error occurred.";
            })
    }
});

export default blogSlice.reducer;