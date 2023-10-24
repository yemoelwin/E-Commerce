import axios from 'axios';

const base_url = 'http://localhost:8080/api';

const api =  axios.create({
    baseURL: base_url,
});

const getTokenFromLocalStorage = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
console.log('getTokenFromLocalStorage', getTokenFromLocalStorage)

api.interceptors.request.use((req) => {
    if (getTokenFromLocalStorage) {
        req.headers.authorization = `Bearer ${getTokenFromLocalStorage.token}`
    }
    return req;
})

api.interceptors.response.use((response) => response, (error) => {
        if (error.response && error.response.status === 401) {
            console.log("token not found. Please log in again.");
        }
        return Promise.reject(error);
    }
);

export default api;

// api.interceptors.request.use((req) => {
//     const accessToken = Cookies.get('accessToken');
//     if (accessToken) {
//         const parsedToken = JSON.parse(accessToken); // Parse the JSON here
//         console.log('parsedToken', parsedToken);
//         console.log('AccessToken', parsedToken.accessToken);
//         req.headers.Authorization = `Bearer ${parsedToken.accessToken}`;
//     }
//     return req;
// });


// api.interceptors.request.use((req) => {
//     if (localStorage.getItem("user")) {
//         req.headers.Authorization = `Bearer ${
//             JSON.parse(localStorage.getItem("user")).token
//         }`;
//     }
//     return req;
// });



