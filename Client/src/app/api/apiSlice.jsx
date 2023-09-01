import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { logOut, setCredentials } from '../../features/auth/test/authSlices';

const baseQuery = fetchBaseQuery({
    baseUrl: 'http://localhost:8080/api',
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
        const token = getState().auth.token;
        if (token) {
            headers.set('authorization', `Bearer ${token}`);
        }
        return headers;
    }
})

const baseQueryWithReAuth = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions)
    if (result?.error?.originalStatus === 403) {
        console.log('sending refresh token');
        // send refresh token to get new access token
        const refreshResult = await baseQuery('/refresh-token', api, extraOptions)
        console.log('refreshResult', refreshResult);
        if (refreshResult?.data) {
            const user = api.getState().auth.user;
            // store the new token
            api.dispatch(setCredentials({ ...refreshResult.data, user }))
            // retry the original query with new access token
            result = await baseQuery(args, api, extraOptions)
        } else {
            api.dispatch(logOut())
        }
    }
    return result;
}

export const apiSlice = createApi({
    baseQuery: baseQueryWithReAuth,
    endpoints: builder => ({})
})






// const baseQuery = fetchBaseQuery({
//     baseUrl: 'http://localhost:8080/api',
//     credentials: 'include',
//     prepareHeaders: (headers, { getState }) => {
//         const token = getState().auth.token;
//         if (token) {
//             headers.set('authorization', `Bearer ${token}`)
//         }
//         return headers
//     }
// });

// const baseQueryWithReAuth = async (args, api, extraOptions) => {
//     let result = await baseQuery(args, api, extraOptions);
//     if (result?.error?.originalStatus === 403) {
//         console.log('sending refresh token');
//         const refreshResult = await baseQuery('/refresh-token', api, extraOptions)
//         console.log(refreshResult);
//         if (refreshResult?.data) {
//             const user = api.getState().auth.user;
//             // store the new token
//             api.dispath(setCredentials({ ...refreshResult.data, user }))
//             // retry the original query with the new access token
//             result = await baseQuery(args, api, extraOptions)
//         } else {
//             api.dispath(setLogout())
//         }
//     }
//     return result;
// };

// export const apiSlice = createApi({
//     baseQuery: baseQueryWithReAuth,
//     endpoints: builder => ({}),
// })