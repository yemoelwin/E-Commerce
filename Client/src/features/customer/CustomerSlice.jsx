import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import customerService from "./CustomerService";

const initialState = {
    users: [],
    isError: false,
    isLoading: false,
    isSuccess: false,
    message: "",
}

export const getUsers = createAsyncThunk('customer/get-customers', async (thunkApi) => {
    try {
        return await customerService.getUsers()
    } catch (error) {
        console.log(error);
        return thunkApi.rejectWithValue(error);
    }
})


export const customerSlice = createSlice({
    name: 'customer',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getUsers.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getUsers.fulfilled, (state, action) => {
                state.isError = false;
                state.isLoading = false;
                state.isSuccess = true;
                state.message = 'Success';
                state.users = action.payload
            })
            .addCase(getUsers.rejected, (state, action) => {
                state.isError = true;
                state.isLoading = false;
                state.isSuccess = false;
                state.message = action.error;
                state.users = null;
            })
    }
});


export default customerSlice.reducer;