import axios from 'axios';

const base_url = 'http://localhost:8080/api';

const api =  axios.create({
    baseURL: base_url,
    // baseURL: "https://dummyjson.com/users"
});

api.interceptors.request.use((req) => {
    if (localStorage.getItem("user")) {
        req.headers.Authorization = `Bearer ${
        JSON.parse(localStorage.getItem("user")).token
        }`;
    }
    return req;
});

export default api;