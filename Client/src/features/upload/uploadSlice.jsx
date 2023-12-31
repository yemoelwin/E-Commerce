import { createSlice, createAsyncThunk, createAction } from '@reduxjs/toolkit';
import uploadService from './uploadService';

const initialState = {
    prodimages: [],
    isError: false,
    isLoading: false,
    isSuccess: false,
    message: "",
}

export const productImgUpload = createAsyncThunk('product/uploadImages', async (formData, thunkApi) => {
    try {
        // const folderName = "products"
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

export const removeImage = createAction('remove_image');

export const imageUploadSlice = createSlice({
    name: 'images',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(productImgUpload.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(productImgUpload.fulfilled, (state, action) => {
                state.prodimages = action.payload;
                state.isError = false;
                state.isSuccess = true;
                state.isLoading = false;
                state.message = 'Success';
            })
            .addCase(productImgUpload.rejected, (state, action) => {
                state.prodimages = null;
                state.isError = true;
                state.isSuccess = false;
                state.isLoading = false;
                state.message = action.error.message || "An error occurred.";
            })
            .addCase(deleteImages.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteImages.fulfilled, (state, action) => {
                state.prodimages = action.payload;
                state.isError = false;
                state.isSuccess = true;
                state.isLoading = false;
                state.message = 'Success';
            })
            .addCase(deleteImages.rejected, (state, action) => {
                state.prodimages = null;
                state.isError = true;
                state.isSuccess = false;
                state.isLoading = false;
                state.message = action.payload || "An error occurred.";
            })
            .addCase(removeImage, () => initialState);
    }
});


export default imageUploadSlice.reducer;