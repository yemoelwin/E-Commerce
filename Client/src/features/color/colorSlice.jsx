import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
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
        return await colorService.getColors();
    } catch (error) {
        console.log(error);
        return thunkApi.rejectWithValue(error);
    }
});

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
    }
});

export default colorSlice.reducer;