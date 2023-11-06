import { createSlice, createAsyncThunk, createAction } from '@reduxjs/toolkit';
import authService from './AuthServices';
const getUserfromLocalStorage = JSON.parse(localStorage.getItem("user"))

const initialState = {
    users: getUserfromLocalStorage ? getUserfromLocalStorage : [],
    isAuthenticated: false,
    isLoggedIn: false,
    isError: false,
    isLoading: false,
    isSuccess: false,
    message: "",
    errorMessage: '',
};

export const register = createAsyncThunk('auth/register', async (data, thunkApi) => {
    try {
        const response = await authService.register(data);
        return response;
    } catch (error) {
        const errorMessage = error.message || "An error occurred.";
        return thunkApi.rejectWithValue(errorMessage);
    }
})

export const login = createAsyncThunk('auth/login', async (userData, thunkApi) => {
    console.log('sliceloginData', userData);
    try {
        const response = await authService.login(userData);
        localStorage.setItem('user', JSON.stringify(response));
        return response;
    } catch (error) {
        const errorMessage = error.message || "An error occurred.";
        return thunkApi.rejectWithValue(errorMessage);
    }
});

export const forgotPasswordToken = createAsyncThunk('auth/forgot-password', async (data, thunkApi) => {
    console.log('sliceresetEmail', data);
    try {
        const response = await authService.forgotPasswordToken(data);
        return response;
    } catch (error) {
        const errorMessage = error.message || "An error occurred.";
        return thunkApi.rejectWithValue(errorMessage);
    }
});

export const resetNewPassword = createAsyncThunk('auth/reset-password', async (data, thunkApi) => {
    console.log('resetNewPassword', data);
    try {
        const response = await authService.resetPassword(data);
        return response;
    } catch (error) {
        const errorMessage = error.message || "An error occurred.";
        return thunkApi.rejectWithValue(errorMessage);
    }
})
// export const userLogout = createAsyncThunk('auth/logout', async (thunkApi) => {
//     try {
//         const response = await authService.logout();
//         return response;
//     } catch (error) {
//         const errorMessage = error.message || "An error occurred.";
//         return thunkApi.rejectWithValue(errorMessage);
//     }
// });

export const authResetState = createAction('remove_all');


export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.users = action.payload;
        },
        logout: (state, action) => {
            state.isError = false;
            state.isLoading = false;
            state.isSuccess = false;
            state.isLoggedIn = false;
            state.isAuthenticated = false;
            state.errorMessage = null;
            state.message = "Success";
            state.users = [];
        },
        clearErrorMessage: (state) => {
            state.isError = false;
            state.errorMessage = '';
        }
    },
    extraReducers: (builder) => {
        builder
            /* Register */
            .addCase(register.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.isError = false;
                state.isAuthenticated = false;
                state.isLoading = false;
                state.isSuccess = true;
                state.isLoggedIn = true;
                state.message = "Success";
                state.createdUser = action.payload;
                state.errorMessage = null;
            })
            .addCase(register.rejected, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = false;
                state.isError = true;
                state.isSuccess = false;
                state.users = null;
                state.isLoggedIn = false;
                state.errorMessage = action.payload || "An error occurred.";
            })
            /* Login */
            .addCase(login.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(login.fulfilled, (state, action) => {
                // localStorage.setItem('user', JSON.stringify({ ...action.payload }));
                state.isError = false;
                state.isLoading = false;
                state.errorMessage = null;
                state.isSuccess = true;
                state.isLoggedIn = true;
                state.isAuthenticated = true;
                state.message = "Success";
                state.users = action.payload;
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = false;
                state.isError = true;
                state.isSuccess = false;
                state.users = null;
                state.isLoggedIn = false;
                state.errorMessage = action.payload
                state.message = 'Failed'
            })
            /* Request Confirmation to Reset Password */
            .addCase(forgotPasswordToken.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(forgotPasswordToken.fulfilled, (state, action) => {
                state.isError = false;
                state.isLoading = false;
                state.isSuccess = true;
                state.isLoggedIn = false;
                state.isAuthenticated = false;
                state.errorMessage = null;
                state.users = null;
                state.message = "Success";
                state.returnData = action.payload;
            })
            .addCase(forgotPasswordToken.rejected, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = false;
                state.isError = true;
                state.isSuccess = false;
                state.users = null;
                state.isLoggedIn = false;
                state.errorMessage = action.payload;
                state.message = 'Failed'
            })
            /* Reset the New Password */
            .addCase(resetNewPassword.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(resetNewPassword.fulfilled, (state, action) => {
                state.isError = false;
                state.isLoading = false;
                state.isSuccess = true;
                state.isLoggedIn = false;
                state.errorMessage = null;
                state.isAuthenticated = false;
                state.message = "Success";
                state.users = null;
                state.newPassword = action.payload;
            })
            .addCase(resetNewPassword.rejected, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = false;
                state.isError = true;
                state.isSuccess = false;
                state.users = null;
                state.isLoggedIn = false;
                state.errorMessage = action.payload;
                state.message = 'Failed'
            })
            .addCase(authResetState, () => initialState)
        
    },
})

export const { setUser, logout, clearErrorMessage } = authSlice.actions;

export default authSlice.reducer;


  // const { orderProduct } = action.payload;
                // // Check if orderProduct is defined and contains products
                // if (orderProduct && Array.isArray(orderProduct.products)) {
                //     const products = orderProduct.products;
                    
                //     // Assuming you want the data from the first product (index 0)
                //     if (products.length > 0) {
                //         const { title, brand, color, _id } = products[0].product;
                //         console.log('Product Data:', { title, brand, color, _id });
                //     } else {
                //         console.log('No products found in orderProduct.');
                //     }
                // } else {
                //     console.log('No orderProduct or products found in action.payload.');
                // }
                // // const { orders.products } = action.payload;
                // // console.log('orders',orders);

