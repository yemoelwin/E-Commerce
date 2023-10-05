import { createSlice, createAsyncThunk, createAction } from '@reduxjs/toolkit';
import inquiryService from './inquiryService';

const initialState = {
    inquiries: [],
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: '',
};

export const createContact = createAsyncThunk('inquiry/create-contact', async(data, thunkApi) => {
    try {
        const response = await inquiryService.createInquiry(data);
        return response;
    } catch (error) {
        console.log(error);
        const errorMessage = error.message || "An error occurred.";
        return thunkApi.rejectWithValue(errorMessage);
    }
});

export const getAllInquiries = createAsyncThunk('inquiry/get-all-Inquiry', async(thunkApi) => {
    try {
        const response = await inquiryService.getEnquiries();
        return response;
    } catch (error) {
        console.log(error);
        const errorMessage = error.message || "An error occurred.";
        return thunkApi.rejectWithValue(errorMessage);
    }
});

export const getInquiry = createAsyncThunk('inquiry/get-inquiry', async(id, thunkApi) => {
    try {
        const response = await inquiryService.getInquiry(id);
        return response;
    } catch (error) {
        console.log(error);
        const errorMessage = error.message || "An error occurred.";
        return thunkApi.rejectWithValue(errorMessage);
    }
});

export const updateInquiry = createAsyncThunk('inquiry/update-inquiry', async(data, thunkApi) => {
    try {
        const response = await inquiryService.updateInquiry(data);
        return response;
    } catch (error) {
        console.log(error);
        const errorMessage = error.message || "An error occurred.";
        return thunkApi.rejectWithValue(errorMessage);
    }
});

export const deleteInquiry = createAsyncThunk('inquiry/delete-inquiry', async(id, thunkApi) => {
    try {
        const response = await inquiryService.deleteInquiry(id);
        return response;
    } catch (error) {
        console.log(error);
        const errorMessage = error.message || "An error occurred.";
        return thunkApi.rejectWithValue(errorMessage);
    }
});

export const inquiryResetState = createAction('reset');

export const inquirySlice = createSlice({
    name: 'inquiry',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllInquiries.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getAllInquiries.fulfilled, (state, action) => {
                state.inquiries = action.payload;
                state.isError = false;
                state.isSuccess = true;
                state.isLoading = false;
                state.message = 'Success';
            })
            .addCase(getAllInquiries.rejected, (state, action) => {
                state.inquiries = null;
                state.isError = true;
                state.isSuccess = false;
                state.isLoading = false;
                state.message = action.payload || "An error occurred.";
            })
            /* Create Contact */
            .addCase(createContact.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createContact.fulfilled, (state, action) => {
                state.isError = false;
                state.isSuccess = true;
                state.isLoading = false;
                state.message = 'Success';
                state.inquiries = action.payload;
            })
            .addCase(createContact.rejected, (state, action) => {
                state.inquiries = null;
                state.isError = true;
                state.isSuccess = false;
                state.isLoading = false;
                state.message = action.payload || "An error occurred.";
            })
            /* Fetch Single Inquiry */
            .addCase(getInquiry.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getInquiry.fulfilled, (state, action) => {
                const { name, email, comments, mobile, status } = action.payload;
                state.isError = false;
                state.isSuccess = true;
                state.isLoading = false;
                state.message = 'Success';
                state.inquiryData = { name, email, comments, mobile, status };
            })
            .addCase(getInquiry.rejected, (state, action) => {
                state.inquiries = null;
                state.isError = true;
                state.isSuccess = false;
                state.isLoading = false;
                state.message = action.payload || "An error occurred.";
            })
            /* Update Inquiry */
            .addCase(updateInquiry.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateInquiry.fulfilled, (state, action) => {
                state.isError = false;
                state.isSuccess = true;
                state.isLoading = false;
                state.message = 'Success';
                state.inquiryStatus = action.payload.status;
            })
            .addCase(updateInquiry.rejected, (state, action) => {
                state.inquiries = null;
                state.isError = true;
                state.isSuccess = false;
                state.isLoading = false;
                state.message = action.payload || "An error occurred.";
            })
            /* Delete Inquiry */
            .addCase(deleteInquiry.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteInquiry.fulfilled, (state, action) => {
                state.isError = false;
                state.isSuccess = true;
                state.isLoading = false;
                state.message = 'Success';
                state.deletedInquiry = action.payload;
            })
            .addCase(deleteInquiry.rejected, (state, action) => {
                state.inquiries = null;
                state.isError = true;
                state.isSuccess = false;
                state.isLoading = false;
                state.message = action.payload || "An error occurred.";
            })
            .addCase(inquiryResetState, () => initialState);
    }
});

export default inquirySlice.reducer;