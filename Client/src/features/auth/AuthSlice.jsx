import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from './AuthServices';

// const getUserfromLocalStorage = localStorage.getItem("user")
//     ? JSON.parse(localStorage.getItem("user"))
//     : null;

const initialState = {
    users : [],
    orders: [],
    isAuthenticated: false,
    isLoggedIn: false,
    isError: false,
    isLoading: false,
    isSuccess: false,
    message: "",
};

export const login = createAsyncThunk('auth/login', async (userData, rejectWithValue) => {
    try {
        return await authService.login(userData);
    } catch (error) {
        console.log(error);
        return rejectWithValue(error.message || "An error occurred.");
        // throw error;
    }
});

export const fetchOrders = createAsyncThunk('auth/get-orders', async(rejectWithValue) => {
    try {
        return await authService.getOrders();
    } catch (error) {
        console.log(error);
        // return rejectWithValue(error.message || "An error occurred.");
        throw error;
    }
});

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
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.users = action.payload;
                localStorage.setItem('user', JSON.stringify({ ...action.payload }));
                state.isError = false;
                state.isAuthenticated = true;
                state.isLoading = false;
                state.isSuccess = true;
                state.isLoggedIn = true;
                state.message = "Success";
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = false;
                state.isError = true;
                state.isSuccess = false;
                state.users = null;
                state.isLoggedIn = false;
                state.message = action.error.message || "An error occurred.";
            })
            .addCase(fetchOrders.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchOrders.fulfilled, (state, action) => {
                state.orders = action.payload;
                state.isAuthenticated = true;
                state.isError = false;
                state.isLoading = false;
                state.isSuccess = true;
                    // state.isLoggedIn = true;
                state.message = "Success";
                })
            .addCase(fetchOrders.rejected, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = false;
                state.isError = true;
                state.isSuccess = false;
                state.orders = null;
                state.isLoggedIn = false;
                state.message = action.error.message || "An error occurred.";
            })
    },
})

export const { setUser, logout, clearToken } = authSlice.actions;

export default authSlice.reducer;



                // const { user, accessToken } = action.payload;
                // state.user = user;
                // state.token = accessToken;
                // localStorage.setItem('token', accessToken);

// export const authSlice = createSlice({
//     name: 'auth',
//     initialState,
//     reducers: {
        
//     },
//     extraReducers: (builder) => {
//         builder
//             .addCase(login.pending, (state) => {
//                 state.isLoading = true;
//             })
//             .addCase(login.fulfilled, (state, action) => {
//                 state.isError = false;
//                 state.isLoading = false;
//                 state.isSuccess = true;
//                 state.user = action.payload;
//                 state.message = 'Success';
//             })
//             .addCase(login.rejected, (state, action) => {
//                 state.isLoading = false;
//                 state.isError = true;
//                 state.isSuccess = false;
//                 state.user = null;
//                 state.message = action.error;
//             });
//     },
// });


// export const login = createAsyncThunk('auth/login', async (loginData) => {
//   // Simulate API call or actual login logic
//   const response = await fetch('/api/login', {
//     method: 'POST',
//     body: JSON.stringify(loginData),
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   });

//   if (!response.ok) {
//     const errorData = await response.json();
//     throw new Error(errorData.message);
//   }

//   const data = await response.json();
//   return data;
// });

// // setCredentials: (state, action) => {
//         //     const { user, accessToken } = action.payload;
//         //     state.user = user;
//         //     state.token = accessToken;
//         // },
//         // setLogout: (state, action) => {
//         //     state.user = null;
//         //     state.token = null;
//         // }
