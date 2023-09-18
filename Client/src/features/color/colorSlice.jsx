import { createSlice, createAsyncThunk, createAction } from '@reduxjs/toolkit';
import colorService from './colorService';

const initialState = {
    colors: [],
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: '',
};

export const getColors = createAsyncThunk('color/get-colors', async(thunkApi) => {
    try {
        const response = await colorService.getColors();
        return response;
    } catch (error) {
        console.log(error);
        return thunkApi.rejectWithValue(error);
    }
});

export const createColor = createAsyncThunk('color/create-color', async(colorData, thunkApi) => {
    try {
        const response = await colorService.createColor(colorData);
        return response;
    } catch (error) {
        console.log(error);
        return thunkApi.rejectWithValue(error);
    }
});

export const fetchColor = createAsyncThunk('color/get-color', async(id, thunkApi) => {
    try {
        const response = await colorService.getColor(id);
        return response;
    } catch (error) {
        console.log(error);
        const errorMessage = error.message || 'An error occurred.'
        return thunkApi.rejectWithValue(errorMessage);
    }
});

export const updateColor = createAsyncThunk('color/update-color', async(data, thunkApi) => {
    try {
        const response = await colorService.updateColor(data);
        return response;
    } catch (error) {
        console.log(error);
        const errorMessage = error.message || 'An error occurred.'
        return thunkApi.rejectWithValue(errorMessage);
    }
});

export const deleteColor = createAsyncThunk('color/delete-color', async (id, thunkApi) => {
    try {
        const response = await colorService.deleteColor(id);
        return response;
    } catch (error) {
        console.log(error);
        const errorMessage = error.message || 'An error occurred.'
        return thunkApi.rejectWithValue(errorMessage);
    }
})

export const colorResetState = createAction("reset_all");

export const colorSlice = createSlice({
    name: 'color',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getColors.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getColors.fulfilled, (state, action) => {
                state.colors = action.payload;
                state.isError = false;
                state.isSuccess = true;
                state.isLoading = false;
                state.message = 'Success';
            })
            .addCase(getColors.rejected, (state, action) => {
                state.colors = null;
                state.isError = true;
                state.isSuccess = false;
                state.isLoading = false;
                state.message = action.error.message || "An error occurred.";
            })
            /* Create Color */
            .addCase(createColor.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createColor.fulfilled, (state, action) => {
                state.createdColor = action.payload;
                state.isError = false;
                state.isSuccess = true;
                state.isLoading = false;
                state.message = 'Success';
            })
            .addCase(createColor.rejected, (state, action) => {
                state.colors = null;
                state.isError = true;
                state.isSuccess = false;
                state.isLoading = false;
                state.message = action.payload || "An error occurred.";
            })
            /* Fetch single color */
            .addCase(fetchColor.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchColor.fulfilled, (state, action) => {
                state.isError = false;
                state.isSuccess = true;
                state.isLoading = false;
                state.message = 'Success';
                state.colorName = action.payload.color;
            })
            .addCase(fetchColor.rejected, (state, action) => {
                state.colors = null;
                state.isError = true;
                state.isSuccess = false;
                state.isLoading = false;
                state.message = action.payload || "An error occurred.";
            })
            /* Update Color */
            .addCase(updateColor.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateColor.fulfilled, (state, action) => {
                state.isError = false;
                state.isSuccess = true;
                state.isLoading = false;
                state.message = 'Success';
                state.updatedColor = action.payload;
            })
            .addCase(updateColor.rejected, (state, action) => {
                state.colors = null;
                state.isError = true;
                state.isSuccess = false;
                state.isLoading = false;
                state.message = action.error.message || "An error occurred.";
            })
            /* Delete Color */
            .addCase(deleteColor.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteColor.fulfilled, (state, action) => {
                state.isError = false;
                state.isSuccess = true;
                state.isLoading = false;
                state.message = 'Success';
                state.deletedColor = action.payload;
            })
            .addCase(deleteColor.rejected, (state, action) => {
                state.colors = null;
                state.isError = true;
                state.isSuccess = false;
                state.isLoading = false;
                state.message = action.payload || "An error occurred.";
            })
            .addCase(colorResetState, () => initialState);
    }
});

export default colorSlice.reducer;