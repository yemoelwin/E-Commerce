import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import inquiryService from './inquiryService';

const initialState = {
    inquiries: [],
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: '',
};

export const getInquiry = createAsyncThunk('inquiry/get-inquiry', async(_,thunkApi) => {
    try {
        // const token = localStorage.getItem('token');
        // if (!token) {
        // // Handle the case where the token is missing from localStorage
        // throw new Error('Token is missing');
        // }
        return await inquiryService.getEnquiries();
    } catch (error) {
        console.log(error);
        throw error
        // return thunkApi.rejectWithValue(error);
    }
});

export const inquirySlice = createSlice({
    name: 'inquiry',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getInquiry.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getInquiry.fulfilled, (state, action) => {
                state.inquiries = action.payload;
                state.isError = false;
                state.isSuccess = true;
                state.isLoading = false;
                state.message = 'Success';
            })
            .addCase(getInquiry.rejected, (state, action) => {
                state.inquiries = null;
                state.isError = true;
                state.isSuccess = false;
                state.isLoading = false;
                state.message = action.error.message || "An error occurred.";
        })
    }
});

export default inquirySlice.reducer;