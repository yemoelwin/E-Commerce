import { createSlice, createAsyncThunk, createAction } from '@reduxjs/toolkit';
import categoryService from './categoryService';

const initialState = {
    categories: [],
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: '',
};

export const getAllCategory = createAsyncThunk('category/get-categories', async(thunkApi) => {
    try {
        return await categoryService.getAllCategory();
    } catch (error) {
        console.log(error);
        return thunkApi.rejectWithValue(error);
    }
});

export const createCategory = createAsyncThunk('category/create-category', async(categoryData, thunkApi) => {
    try {
        return await categoryService.createCategory(categoryData);
    } catch (error) {
        console.log(error);
        return thunkApi.rejectWithValue(error);
    }
});

export const updateCategory = createAsyncThunk('category/updated-category', async(data, thunkApi) => {
    try {
        const response = await categoryService.updateCategory(data);
        return response;
    } catch (error) {
        console.log(error);
        const errorMessage = error.message || "An error occurred.";
        return thunkApi.rejectWithValue(errorMessage);
    }
});

export const getCategory = createAsyncThunk('category/get-category', async(id, thunkApi) => {
    try {
        const response =  await categoryService.getCategory(id);
        return response;
    } catch (error) {
        console.log(error);
        const errorMessage = error.message || "An error occurred.";
        return thunkApi.rejectWithValue(errorMessage);
    }
});

export const deleteCategory = createAsyncThunk('category/delete-category', async(id, thunkApi) => {
    try {
        const response = await categoryService.deleteCategory(id);
        return response;
    } catch (error) {
        console.log(error);
        const errorMessage = error.message || "An error occurred.";
        return thunkApi.rejectWithValue(errorMessage);
    }
});

export const categoryResetState = createAction("reset_all");

export const categorySlice = createSlice({
    name: 'category',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllCategory.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getAllCategory.fulfilled, (state, action) => {
                state.categories = action.payload;
                state.isError = false;
                state.isSuccess = true;
                state.isLoading = false;
                state.message = 'Success';
            })
            .addCase(getAllCategory.rejected, (state, action) => {
                state.categories = null;
                state.isError = true;
                state.isSuccess = false;
                state.isLoading = false;
                state.message = action.error.message || "An error occurred.";
            })
            /* Create Category */
            .addCase(createCategory.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createCategory.fulfilled, (state, action) => {
                state.createdCategory = action.payload;
                state.isError = false;
                state.isSuccess = true;
                state.isLoading = false;
                state.message = 'Success';
            })
            .addCase(createCategory.rejected, (state, action) => {
                state.categories = null;
                state.isError = true;
                state.isSuccess = false;
                state.isLoading = false;
                state.message = action.payload || "An error occurred.";
            })
            /* Get single category */
            .addCase(getCategory.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getCategory.fulfilled, (state, action) => {
                state.isError = false;
                state.isSuccess = true;
                state.isLoading = false;
                state.message = 'Success';
                state.categoryName = action.payload.title;
            })
            .addCase(getCategory.rejected, (state, action) => {
                state.categories = null;
                state.isError = true;
                state.isSuccess = false;
                state.isLoading = false;
                state.message = action.error.message || "An error occurred.";
            })
            /* Update Category */
            .addCase(updateCategory.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateCategory.fulfilled, (state, action) => {
                state.isError = false;
                state.isSuccess = true;
                state.isLoading = false;
                state.message = 'Success';
                state.updatedCategory = action.payload;
            })
            .addCase(updateCategory.rejected, (state, action) => {
                state.categories = null;
                state.isError = true;
                state.isSuccess = false;
                state.isLoading = false;
                state.message = action.error.message || "An error occurred.";
            })
            /* Delete Category */
            .addCase(deleteCategory.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteCategory.fulfilled, (state, action) => {
                state.isError = false;
                state.isSuccess = true;
                state.isLoading = false;
                state.message = 'Success';
                state.deletedCategory = action.payload;
            })
            .addCase(deleteCategory.rejected, (state, action) => {
                state.categories = null;
                state.isError = true;
                state.isSuccess = false;
                state.isLoading = false;
                state.message = action.error.message || "An error occurred.";
            })
            /* Update Category */
            .addCase(categoryResetState, () => initialState);
    }
});

export default categorySlice.reducer;