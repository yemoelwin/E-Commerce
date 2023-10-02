import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// import { useNavigate } from 'react-router-dom';

const base_url = 'http://localhost:8080/api';

const api =  axios.create({
    baseURL: base_url,
});

const getTokenFromLocalStorage = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

api.interceptors.request.use((req) => {
    if (getTokenFromLocalStorage) {
        req.headers.Authorization = `Bearer ${getTokenFromLocalStorage !== null ? getTokenFromLocalStorage.token : null}`
    }
    return req;
})
// api.interceptors.request.use((req) => {
//     if (localStorage.getItem("user")) {
//         req.headers.Authorization = `Bearer ${
//             JSON.parse(localStorage.getItem("user")).token
//         }`;
//     }
//     return req;
// });

api.interceptors.request.use((response) => response, (error) => {
    if (error.response && error.response.status === 401) {
        const navigate = useNavigate();
        navigate('/login');
        console.log("Token has expired. Please log in again.");
    }
    return Promise.reject(error);
})

export default api ;