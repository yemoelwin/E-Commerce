import { createSlice, createAsyncThunk, createAction } from '@reduxjs/toolkit';
import authService from './AuthServices';
// import Cookies from 'js-cookie';
const getUserfromLocalStorage = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

const role = getUserfromLocalStorage?.role;
console.log(role)

const initialState = {
    users : [],
    isAuthenticated: false,
    isLoggedIn: false,
    isError: false,
    isLoading: false,
    isSuccess: false,
    errorMessage: '',
    message: "",
    userRole: role,
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
        return response;
    } catch (error) {
        const errorMessage = error.message || "An error occurred.";
        return thunkApi.rejectWithValue(errorMessage);
    }
});

export const authResetState = createAction('remove_all');


export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.users = action.payload;
            state.isAuthenticated = true;
        },
        logout: (state) => {
            state.users = null;
            localStorage.clear();
            state.isLoggedIn = false;
            state.isAuthenticated = false;
            state.isSuccess = false; // Clear success state on logout
            state.message = "Successfully clear user's token"; // Clear any error messages on logout
        },
        clearToken: (state) => {
            state.users = null;
            state.isAuthenticated = false;
            localStorage.removeItem('user');
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
                localStorage.setItem('user', JSON.stringify({ ...action.payload }));
                // state.accessToken = action.payload.accessToken;
                // console.log('slice accessTOken', accessToken)
                // Cookies.set('user', JSON.stringify({ accessToken: action.payload.accessToken }));
                state.isError = false;
                state.isLoading = false;
                state.isSuccess = true;
                state.isLoggedIn = true;
                state.errorMessage = null;
                state.message = "Success";
                state.users = action.payload;
                state.userRole = action.payload.role;
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = false;
                state.isError = true;
                state.isSuccess = false;
                state.users = null;
                state.isLoggedIn = false;
                state.userRole = null;
                state.errorMessage = action.payload
                state.message = 'Failed'
            })
            .addCase(authResetState, () => initialState)
        
    },
})

export const { setUser, logout, clearToken, clearErrorMessage } = authSlice.actions;

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

