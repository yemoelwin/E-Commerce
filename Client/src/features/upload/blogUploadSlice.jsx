import { createSlice, createAsyncThunk, createAction } from '@reduxjs/toolkit';
import blogUploadService from './blogUploadService';

const initialState = {
    images: [],
    isError: false,
    isLoading: false,
    isSuccess: false,
    message: "",
}

export const blogImgUpload = createAsyncThunk('blog/uploadImages', async (formData, thunkApi) => {
    try {
        // const folderName = "products"
        const response = await blogUploadService.blogUploadImg(formData);
        return response;
    } catch (error) {
        console.log("error while uploading",error);
        return thunkApi.rejectWithValue(error);
    }
});

export const deleteImages = createAsyncThunk('delete/uploadImages', async (id, thunkApi) => {
    try {
        const response = await blogUploadService.deleteImg(id);
        return response;
    } catch (error) {
        console.log("error while uploading",error);
        return thunkApi.rejectWithValue(error);
    }
});

export const clearImageState = createAction('remove-image');

export const blogImageUploadSlice = createSlice({
    name: 'images',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(blogImgUpload.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(blogImgUpload.fulfilled, (state, action) => {
                state.images = action.payload;
                state.isError = false;
                state.isSuccess = true;
                state.isLoading = false;
                state.message = 'Success';
            })
            .addCase(blogImgUpload.rejected, (state, action) => {
                state.images = null;
                state.isError = true;
                state.isSuccess = false;
                state.isLoading = false;
                state.message = action.error.message || "An error occurred.";
            })
            .addCase(deleteImages.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteImages.fulfilled, (state, action) => {
                state.images = action.payload;
                state.isError = false;
                state.isSuccess = true;
                state.isLoading = false;
                state.message = 'Success';
            })
            .addCase(deleteImages.rejected, (state, action) => {
                state.images = null;
                state.isError = true;
                state.isSuccess = false;
                state.isLoading = false;
                state.message = action.payload || "An error occurred.";
            })
            .addCase(clearImageState, () => initialState);
    }
});


export default blogImageUploadSlice.reducer;