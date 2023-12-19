import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import incomeAndOrderService from "./incomeAndOrderService";

const initialState = {
	monthly: [],
	yearly: [],
	isLoading: false,
	isError: false,
	isSuccess: false,
	message: "",
};

export const getYearly = createAsyncThunk(
	"incomeAndOrderService/get-yearly",
	async (thunkApi) => {
		try {
			const response = await incomeAndOrderService.getYearlyIncomesAndOrders();
			return response;
		} catch (error) {
			console.log(error);
			return thunkApi.rejectWithValue(error);
		}
	},
);

export const getMonthly = createAsyncThunk(
	"incomeAndOrderService/get-monthly",
	async (selectedYear, thunkApi) => {
		try {
			const response = await incomeAndOrderService.getMonthlyIncomesAndOrders(
				selectedYear,
			);
			return response;
		} catch (error) {
			console.log(error);
			return thunkApi.rejectWithValue(error);
		}
	},
);

export const incomeAndOrderSlice = createSlice({
	name: "incomeAndOrder",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(getYearly.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(getYearly.fulfilled, (state, action) => {
				state.isError = false;
				state.isSuccess = true;
				state.isLoading = false;
				state.message = "Success";
				state.yearly = action.payload;
			})
			.addCase(getYearly.rejected, (state, action) => {
				state.yearly = null;
				state.isError = true;
				state.isSuccess = false;
				state.isLoading = false;
				state.message = action.error.message || "An error occurred.";
			})
			/* Monthly */
			.addCase(getMonthly.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(getMonthly.fulfilled, (state, action) => {
				state.isError = false;
				state.isSuccess = true;
				state.isLoading = false;
				state.message = "Success";
				state.monthly = action.payload;
			})
			.addCase(getMonthly.rejected, (state, action) => {
				state.monthly = null;
				state.isError = true;
				state.isSuccess = false;
				state.isLoading = false;
				state.message = action.error.message || "An error occurred.";
			});
	},
});

export default incomeAndOrderSlice.reducer;
