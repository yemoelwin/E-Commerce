import axios from "axios";

const base_url = "http://localhost:8080/api";

const api = axios.create({
	baseURL: base_url,
});

const alertMessage = `Authentication has expired, pls login again.`;

api.interceptors.request.use((config) => {
	const token = JSON.parse(localStorage.getItem("user"))?.token;
	if (token) {
		config.headers.authorization = `Bearer ${token}`;
	}
	return config;
});

api.interceptors.response.use(
	(response) => response,
	(error) => {
		if (
			error.response &&
			error.response.status === 401 &&
			error.response.statusText === "Unauthorized"
		) {
			const { data } = error.response;
			if (data && data.message === "User with this email does not exist.") {
				console.log("User with this email does not exist");
			} else if (data && data.message === "Invalid Password") {
				console.log("Invalid Password");
			} else {
				localStorage.clear();
				window.location.href = `/login?alertMessage=${encodeURIComponent(
					alertMessage,
				)}`;
			}
		}
		return Promise.reject(error);
	},
);

export default api;

// const getTokenFromLocalStorage = JSON.parse(localStorage.getItem('user'));
// console.log('getATokenFromLocalStorage', getTokenFromLocalStorage?.token);

// api.interceptors.request.use((req) => {
//     if (getTokenFromLocalStorage?.token !== undefined) {
//         return req.headers.authorization = `Bearer ${getTokenFromLocalStorage.token}`
//     }
//     return req;
// })

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
