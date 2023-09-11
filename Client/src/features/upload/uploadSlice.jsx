import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import uploadService from './uploadService';

const initialState = {
    images: [],
    isError: false,
    isLoading: false,
    isSuccess: false,
    message: "",
}

export const uploadImages = createAsyncThunk('product/uploadImages', async (formData, thunkApi) => {
    try {
        return await uploadService.uploadImg(formData);
    } catch (error) {
        console.log("error while uploading",error);
        return thunkApi.rejectWithValue(error);
    }
});

export const deleteImages = createAsyncThunk('delete/uploadImages', async (id, thunkApi) => {
    try {
        return await uploadService.deleteImg(id);
    } catch (error) {
        console.log("error while uploading",error);
        return thunkApi.rejectWithValue(error);
    }
});

export const imageUploadSlice = createSlice({
    name: 'images',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(uploadImages.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(uploadImages.fulfilled, (state, action) => {
                state.images = action.payload;
                state.isError = false;
                state.isSuccess = true;
                state.isLoading = false;
                state.message = 'Success';
            })
            .addCase(uploadImages.rejected, (state, action) => {
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
    }
});


export default imageUploadSlice.reducer;